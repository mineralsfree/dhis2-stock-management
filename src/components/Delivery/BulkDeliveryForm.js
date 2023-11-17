import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  InputFieldFF,
  ReactFinalForm,
  Button,
  createMinNumber,
  SingleSelectFieldFF,
  hasValue,
} from "@dhis2/ui";
import { useCommodities } from "../../hooks/useCommodities";
import {
  commoditiesToOptions,
  stockBalanceById,
} from "../../utils/CommoditiesUtils";
import styles from "./Delivery.module.css";
import PropTypes from "prop-types";

export function BulkDeliveryForm({ user, registerDelivery }) {
  const { loading, error, commodities, refetch } = useCommodities();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!commodities) {
    return null;
  }

  const commodityOptions = commoditiesToOptions(commodities);
  const stockBalance = (id) => stockBalanceById(commodityOptions, id);
  const displayNameFromId = (id) =>
    commodityOptions.find((commodity) => commodity.value === id).label;
  const handle = (values) => {
    const arrivedCommodities = Object.entries(values)
      .filter(([key]) => key.includes("quantity_"))
      .map(([id, quantity]) => ({
        dataElement: id.split("quantity_")[1],
        displayName: displayNameFromId(id.split("quantity_")[1]),
        quantityOrdered: parseInt(quantity),
        newBalance: stockBalance(id.split("quantity_")[1]) + parseInt(quantity),
      }))
      .filter(({ quantityOrdered }) => quantityOrdered > 0);

    const storedBy = values.storedBy;
    const completeDate = values.datetime;

    const input = {
      storedBy,
      completeDate,
      dataValues: arrivedCommodities,
    };

    registerDelivery(input).then(() => {
      refetch();
    });
  };

  return (
    <div className={styles.deliveryContainer}>
      <ReactFinalForm.Form onSubmit={handle}>
        {({ handleSubmit, form }) => (
          <form
            className={styles.deliveryForm}
            onSubmit={(event) => {
              handleSubmit(event);
              form.reset();
            }}
          >
            <ReactFinalForm.Field
              className={styles.storedByField}
              name="storedBy"
              label="Stored by"
              component={SingleSelectFieldFF}
              options={[{ label: user.name, value: user.name }]}
              initialValue={user.name}
              validate={hasValue}
              required
            />
            <Table className={styles.table}>
              <TableHead>
                <TableRowHead>
                  <TableCellHead>Commodity</TableCellHead>
                  <TableCellHead>In stock</TableCellHead>
                  <TableCellHead>Quantity arrived</TableCellHead>
                </TableRowHead>
              </TableHead>
              <TableBody>
                {commodityOptions.map((commodity) => (
                  <TableRow key={commodity.value} className={styles.tableRow}>
                    <TableCell>{commodity.label}</TableCell>
                    <TableCell>{commodity.endBalance}</TableCell>
                    <TableCell>
                      <ReactFinalForm.Field
                        name={`quantity_${commodity.value}`}
                        className={styles.inputField}
                        type="number"
                        component={InputFieldFF}
                        initialValue={
                          commodity.quantityOrdered
                            ? commodity.quantityOrdered.toString()
                            : undefined
                        }
                        validate={createMinNumber(0)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <ReactFinalForm.Field
                className={styles.datetimeInput}
                name="datetime"
                label="Time of arrival"
                type="datetime-local"
                component={InputFieldFF}
                initialValue={new Date().toISOString().slice(0, -8)}
              />
            </div>
            <Button type="submit" primary>
              Register arrival
            </Button>
          </form>
        )}
      </ReactFinalForm.Form>
    </div>
  );
}
BulkDeliveryForm.propTypes = {
  user: PropTypes.objectOf({ name: PropTypes.string }),
  registerDelivery: PropTypes.func,
};
