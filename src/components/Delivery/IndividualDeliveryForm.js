import React from "react";
import {
  CircularLoader,
  hasValue,
  ReactFinalForm,
  composeValidators,
  InputFieldFF,
  SingleSelectFieldFF,
} from "@dhis2/ui";
import "../../styles.css";
import styles from "./Delivery.module.css";
import { Button } from "@dhis2/ui";
import { useCommodities } from "../../hooks/useCommodities";
import {
  commoditiesToOptions,
  stockBalanceById,
} from "../../utils/CommoditiesUtils";
import PropTypes from "prop-types";

export const IndividualDeliveryForm = ({ user, registerDelivery }) => {
  const { loading, error, commodities, refetch } = useCommodities();

  if (loading) {
    return <CircularLoader large />;
  }
  if (!commodities) {
    return null;
  }
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (!commodities) {
    return null;
  }

  const commodityOptions = commoditiesToOptions(commodities);
  const stockBalance = (id) => stockBalanceById(commodityOptions, id);
  const displayNameFromId = (id) =>
    commodityOptions.find((commodity) => commodity.value === id).label;

  const handle = (values) => {
    console.log(values);
    const arrivedCommodity = [
      {
        dataElement: values.commodity,
        displayName: displayNameFromId(values.commodity),
        quantityOrdered: parseInt(values.quantity),
        newBalance: stockBalance(values.commodity) + parseInt(values.quantity),
      },
    ];

    const storedBy = values.storedBy;
    const completeDate = values.datetime;

    const input = {
      storedBy,
      completeDate,
      dataValues: arrivedCommodity,
    };

    registerDelivery(input).then(() => {
      refetch();
    });
  };

  return (
    <div className={styles.deliveryContainer}>
      <ReactFinalForm.Form onSubmit={handle}>
        {({ values, handleSubmit, form }) => (
          <form
            className={styles.deliveryForm}
            onSubmit={(event) => {
              handleSubmit(event);
              form.restart();
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
            <div className={styles.commodityRow}>
              <ReactFinalForm.Field
                className={styles.commodityField}
                name="commodity"
                label="Commodity"
                helpText={`In stock: ${
                  values[`commodity`] ? stockBalance(values[`commodity`]) : ""
                }`}
                component={SingleSelectFieldFF}
                options={commodityOptions}
                validate={hasValue}
                required
              />
              <ReactFinalForm.Field
                className={styles.commodityField}
                name="quantity"
                label="Quantity arrived"
                component={InputFieldFF}
                type="number"
                validate={composeValidators(hasValue)}
                required
              />
            </div>
            <ReactFinalForm.Field
              name="datetime"
              label="Time of arrival"
              className={styles.datetimeInput}
              component={InputFieldFF}
              type="datetime-local"
              initialValue={new Date().toISOString().slice(0, -8)}
              validate={hasValue}
            />
            <Button type="submit" primary>
              Register arrival
            </Button>
          </form>
        )}
      </ReactFinalForm.Form>
    </div>
  );
};

IndividualDeliveryForm.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  registerDelivery: PropTypes.func,
};
