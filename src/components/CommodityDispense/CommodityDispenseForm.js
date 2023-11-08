import {
  Card,
  InputFieldFF,
  ReactFinalForm,
  SingleSelectFieldFF,
  hasValue,
  composeValidators,
  createNumberRange,
  Button,
  Chip,
  IconAdd24,
  CircularLoader,
  IconDelete24,
} from "@dhis2/ui";

import React, { useState } from "react";
import styles from "./CommodityDispenseForm.module.css";
import { useCommodities } from "../../hooks/useCommodities";
import {commoditiesToOptions, stockBalanceById} from "../../utils/CommoditiesUtils";
import {useRecipients} from "../../hooks/useRecipients";
import {recipientsToOptions} from "../../utils/recepientsUtils";
// Fix these later
const dispensedByOptions = [
  { value: "johndoe", label: "John Doe" },
  { value: "janedoe", label: "Jane Doe" },
  { value: "johnsmith", label: "John Smith" },
  { value: "janesmith", label: "Jane Smith" },
];

const dispensedToOptions = [
  { value: "1", label: "John Doe" },
  { value: "2", label: "Jane Doe" },
  { value: "3", label: "John Smith" },
  { value: "4", label: "Jane Smith" },
];

export default function CommodityDispenseForm({ handleRegister }) {
  const [commodityBulk, setCommodityBulk] = useState(["1"]);
  // const [commodityID, setCommodityID] = useState(1);
  const { loading: commoditiesLoading, error, commodities, refetch } = useCommodities();
  const {recipients, loading: recipientsLoading } = useRecipients();
  const recipientsOptions = recipientsToOptions(recipients);
  if (commoditiesLoading || recipientsLoading) {
    return null
  }

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (!commodities) {
    return null;
  }

  const commodityOptions =commoditiesToOptions(commodities);

  const stockBalance = (id)=>stockBalanceById(commodityOptions, id);
  const currentConsumption = (id) =>
    parseInt(commodityOptions.find((com) => com.value === id).consumption);

  console.log("Commodities");
  console.log(commodities);
  console.log(commodityOptions);

  return (
    <div className={styles.form}>
      <Card style={{ padding: "24px" }}>
        <div style={{ padding: "24px" }}>
          <h3>Register commodity dispense</h3>
          <ReactFinalForm.Form
            onSubmit={(values) => {
              console.log("Submitted");
              console.log(values);
              const formInput = {
                dispensedBy: values["dispensedBy"],
                dispensedTo: values["dispensedTo"],
                dateDispensed: values["dateDispensed"],
                timeDispensed: values["timeDispensed"],
                dataValues: commodityBulk.map((c) => ({
                  dataElement: values[`commodity_${c}`],
                  value:
                    parseInt(values[`amount_${c}`]) +
                    currentConsumption(values[`commodity_${c}`]),
                })),
              };
              handleRegister(formInput);
            }}
          >
            {({ values, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
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
                </div>
                <div className={styles.formRow}>
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
                  console.log(values);
                  return (
                    <div className={styles.formCommodityRow} key={c}>
                      <div className={styles.formRow}>
                        <ReactFinalForm.Field
                            className={styles.field}
                          name={`commodity_${c}`}
                          // value={value}
                          label="Commodity"
                          helpText={`In stock: ${
                            values[`commodity_${c}`]
                              ? stockBalance(values[`commodity_${c}`])
                              : ""
                          }`}
                          component={SingleSelectFieldFF}
                          options={commodityOptions}
                          validate={hasValue}
                        />
                        <ReactFinalForm.Field
                          name={`amount_${c}`}
                          label="Amount"
                          component={InputFieldFF}
                          type="number"
                          validate={composeValidators(
                            hasValue,
                            createNumberRange(
                              1,
                              values[`commodity_${c}`]
                                ? stockBalance(values[`commodity_${c}`])
                                : Infinity
                            )
                          )}
                          required
                        />
                      </div>
                      {c !== "1" && (
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
                  />
                  <ReactFinalForm.Field
                    name="timeDispensed"
                    className={styles.field}
                    label="Time dispensed"
                    component={InputFieldFF}
                    type="time"
                    initialValue={new Date().toISOString().slice(11, 16)}
                    validate={hasValue}
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
    </div>
  );
}
