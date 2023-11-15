import styles from "../CommodityDispense/CommodityDispenseForm.module.css";
import React from "react";
import {
  InputFieldFF,
  ReactFinalForm,
  hasValue,
  Button,
  Card,
} from "@dhis2/ui";
import { useDataMutation } from "@dhis2/app-runtime";
import toast from "react-hot-toast";
const dataMutationQuery = {
  dataSet: "ULowA8V3ucd",
  resource: "dataStore/mikimami/recipients",
  type: "update",
  data: (recipients) => ({ recipients }),
};
export const RecipientAddForm = (props) => {
  const { close, recipients, recipientsRefetch } = props;
  const [mutate, {}] = useDataMutation(dataMutationQuery);
  return (
    <ReactFinalForm.Form
      onSubmit={(values) => {
        mutate([...recipients, { name: values.name, dep: values.department }])
          .then((res) => {
            toast.success(
              `Successfully added ${values.name} to recipients database`
            );
            close();
            recipientsRefetch();
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              `Error while adding recipient, check your internet connection`
            );
          });

        // handleRegister(values, setDelete);
      }}
    >
      {({ values, handleSubmit, form }) => (
        <Card>
          <form onSubmit={handleSubmit}>
            <div className={styles.addRecipientForm}>
              <h3>Add new Recipient</h3>
              <div className={styles.addRecipientFields}>
                <ReactFinalForm.Field
                  className={styles.addRecipientField}
                  name="name"
                  label="Name"
                  component={InputFieldFF}
                  type="text"
                  validate={hasValue}
                  required
                />
                <ReactFinalForm.Field
                  className={styles.addRecipientField}
                  name="department"
                  label="Department"
                  component={InputFieldFF}
                  validate={hasValue}
                  required
                />
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "12px" }}
                >
                  <Button type="submit" primary>
                    Add
                  </Button>
                  <Button onClick={close} secondary>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      )}
    </ReactFinalForm.Form>
  );
};
