import {
  Card,
  InputFieldFF,
  ReactFinalForm,
  SingleSelectFieldFF,
  hasValue,
  composeValidators,
  createNumberRange,
  Button,
  CircularLoader,
  Chip,
  IconAdd24,
  IconDelete24,
} from "@dhis2/ui";

import React, { useState } from "react";
import styles from "./CommodityDispenseForm.module.css";
import { useCommodities } from "../../hooks/useCommodities";
import {
  commoditiesToOptions,
  stockBalanceById,
} from "../../utils/CommoditiesUtils";
import { useRecipients } from "../../hooks/useRecipients";
import { recipientsToOptions } from "../../utils/recepientsUtils";
import { RecipientAddForm } from "../RecipentsAddForm/RecipientAddForm";
import PropTypes from "prop-types";

export default function CommodityDispenseForm({ handleRegister }) {
  const [commodityBulk, setCommodityBulk] = useState(["1"]);
  // const [selectedCommodities, setSelectedCommodities] = useState([]);

  const {
    loading: commoditiesLoading,
    error,
    commodities,
    refetch,
  } = useCommodities();

  const {
    recipients,
    loading: recipientsLoading,
    refetch: recipientsRefetch,
  } = useRecipients();

  const recipientsOptions = recipientsToOptions(recipients);
  const [showForm, setShowForm] = useState(false);

  if (commoditiesLoading || recipientsLoading) {
    return <CircularLoader large />;
  }

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (!commodities) {
    return null;
  }

  const commodityOptions = commoditiesToOptions(commodities);

  const getCurrentEndBalance = (id) => stockBalanceById(commodityOptions, id);
  const currentConsumption = (id) =>
    parseInt(commodityOptions.find((com) => com.value === id).consumption);
  const getDisplayName = (id) => {
    const commodity = commodityOptions.find((com) => com.value === id);
    return commodity ? commodity.label : "";
  };

  return (
    <div className={styles.c}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "min-content",
        }}
      >
        <Card>
          <div style={{ padding: "24px", width: "calc(410px + 72px)" }}>
            <ReactFinalForm.Form
              onSubmit={(values) => {
                const data = commodityBulk.map((c) => ({
                  dataElement: values[`commodity_${c}`],
                  amount: parseInt(values[`amount_${c}`]),
                  currentConsumption: currentConsumption(
                    values[`commodity_${c}`]
                  ),
                  currentEndBalance: getCurrentEndBalance(
                    values[`commodity_${c}`]
                  ),
                  displayName: getDisplayName(values[`commodity_${c}`]),
                }));

                const formInput = {
                  dispensedBy: values["dispensedBy"],
                  dispensedTo: values["dispensedTo"],
                  dateDispensed: values["dateDispensed"],
                  timeDispensed: values["timeDispensed"],
                  data: data,
                };
                handleRegister(formInput).then(() => {
                  // refetch commodities when done
                  refetch();
                });
              }}
            >
              {({ values, handleSubmit, form }) => (
                <form
                  onSubmit={(event) => {
                    handleSubmit(event);
                    form.reset();
                    setCommodityBulk(["1"]);
                  }}
                >
                  <div className={styles.formRow}>
                    <ReactFinalForm.Field
                      className={styles.recipient_field}
                      name="dispensedBy"
                      label="Dispensed by"
                      component={SingleSelectFieldFF}
                      options={recipientsOptions}
                      validate={hasValue}
                      required
                    />
                    <ReactFinalForm.Field
                      name="dispensedTo"
                      label="Dispensed to"
                      className={styles.recipient_field}
                      component={SingleSelectFieldFF}
                      options={recipientsOptions}
                      validate={hasValue}
                      required
                    />
                  </div>

                  {commodityBulk.map((c) => {
                    return (
                      <div className={styles.formCommodityRow} key={c}>
                        <div className={styles.formRow}>
                          <ReactFinalForm.Field
                            className={styles.field}
                            name={`commodity_${c}`}
                            label="Commodity"
                            helpText={`In stock: ${
                              values[`commodity_${c}`]
                                ? getCurrentEndBalance(values[`commodity_${c}`])
                                : ""
                            }`}
                            component={SingleSelectFieldFF}
                            options={commodityOptions}
                            validate={hasValue}
                            required
                          />
                          <ReactFinalForm.Field
                            className={styles.field}
                            name={`amount_${c}`}
                            label="Amount"
                            component={InputFieldFF}
                            type="number"
                            validate={composeValidators(
                              hasValue,
                              createNumberRange(
                                1,
                                values[`commodity_${c}`]
                                  ? getCurrentEndBalance(
                                      values[`commodity_${c}`]
                                    )
                                  : Infinity
                              )
                            )}
                            required
                          />
                        </div>
                        {c !== "1" && (
                          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                          <div
                            className={styles.formItemRemove}
                            onClick={() => {
                              setCommodityBulk((curr) =>
                                curr.filter((cc) => cc !== c)
                              );
                              // reset the values
                              values[`commodity_${c}`] = undefined;
                              values[`amount_${c}`] = undefined;
                            }}
                          >
                            <IconDelete24 />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div
                    style={{
                      width: "410px",
                      display: "flex",
                      justifyContent: "center",
                      margin: "0px 0 20px 0",
                    }}
                  >
                    <Chip
                      icon={<IconAdd24 />}
                      onClick={() => {
                        const lastVal = commodityBulk[commodityBulk.length - 1];
                        setCommodityBulk((curr) =>
                          curr.concat([`${parseInt(lastVal) + 1}`])
                        );
                      }}
                      selected
                    >
                      {"Add commodity"}
                    </Chip>
                  </div>

                  <div className={styles.formRow}>
                    <ReactFinalForm.Field
                      name="dateDispensed"
                      className={styles.field}
                      label="Date dispensed"
                      component={InputFieldFF}
                      type="date"
                      initialValue={new Date().toISOString().slice(0, 10)}
                      validate={hasValue}
                      required
                    />
                    <ReactFinalForm.Field
                      name="timeDispensed"
                      className={styles.field}
                      label="Time dispensed"
                      component={InputFieldFF}
                      type="time"
                      // how tf does one get the current format in users timezone but
                      // being saved in UTC time to the api
                      initialValue={new Date().toLocaleString("no-NB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      validate={hasValue}
                      required
                    />
                  </div>

                  <Button type="submit" primary>
                    Register
                  </Button>
                </form>
              )}
            </ReactFinalForm.Form>
          </div>
        </Card>

        <div style={{ background: "none" }}>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {!showForm && (
              <Chip
                icon={<IconAdd24 />}
                onClick={() => {
                  setShowForm(true); // Show the form when the "Add" icon is clicked.
                }}
                selected
              >
                {"Add new recipient"}
              </Chip>
            )}
          </div>
          <div>
            {showForm && (
              <RecipientAddForm
                recipientsRefetch={recipientsRefetch}
                recipients={recipients}
                close={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
CommodityDispenseForm.propTypes = {
  handleRegister: PropTypes.func,
};
