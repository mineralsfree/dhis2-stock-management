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
  IconDelete24,
} from "@dhis2/ui";
import { useState } from "react";
import styles from "./CommodityDispenseForm.module.css";
import { useCommodities } from "../../hooks/useCommodities";

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
  const { loading, error, commodities, refetch } = useCommodities();

  if (loading) {
    return null;
  }

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (!commodities) {
    return null;
  }

  const commodityOptions = [];

  Object.values(commodities).forEach((category) => {
    category.forEach((commodity) => {
      commodityOptions.push({
        label: commodity.displayName,
        value: commodity.id,
        inStock: commodity.inStock,
        consumption: commodity.consumption,
        endBalance: commodity.endBalance,
      });
    });
  });

  // Sort commodity options by category
  commodityOptions.sort((a, b) => {
    if (a.category < b.category) {
      return -1;
    }
    return 1;
  });

  const stockBalance = (id) =>
    parseInt(commodityOptions.find((com) => com.value === id).inStock);
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
                    name="dispensedBy"
                    label="Dispensed by"
                    component={SingleSelectFieldFF}
                    options={dispensedByOptions}
                    validate={hasValue}
                    required
                  />
                  <ReactFinalForm.Field
                    name="dispensedTo"
                    label="Dispensed to"
                    component={SingleSelectFieldFF}
                    options={dispensedToOptions}
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
                    label="Date dispensed"
                    component={InputFieldFF}
                    type="date"
                    initialValue={new Date().toISOString().slice(0, 10)}
                    validate={hasValue}
                  />
                  <ReactFinalForm.Field
                    name="timeDispensed"
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