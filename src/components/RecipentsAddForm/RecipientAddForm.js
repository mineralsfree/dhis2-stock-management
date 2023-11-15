import styles from "../CommodityDispense/CommodityDispenseForm.module.css";
import React from "react";
import {
    InputFieldFF,
    ReactFinalForm,
    hasValue,
    Button,
} from "@dhis2/ui";
import {useDataMutation} from "@dhis2/app-runtime";
import toast from "react-hot-toast";
const dataMutationQuery = {
    dataSet: "ULowA8V3ucd",
    resource: "dataStore/mikimami/recipients",
    type: "update",
    data: (recipients)=>({recipients})
}
export const RecipientAddForm = (props)=>{
    const {close, recipients, recipientsRefetch} = props;
    const [mutate, {}] = useDataMutation(dataMutationQuery);
    return <ReactFinalForm.Form
        onSubmit={(values) => {
            mutate([...recipients, {name: values.name, dep: values.department}])
                .then(res=>{
                    toast.success(`Successfully added ${values.name} to recipients database`)
                    close();
                    recipientsRefetch()
                })
                .catch(err=>{
                    console.log(err);
                    toast.error(`Error while adding recipient, check your internet connection`)
                })

            // handleRegister(values, setDelete);
        }}
    >
        {({ values, handleSubmit, form }) => (
            <form onSubmit={handleSubmit}>
                <div className={styles.formRecipient}>
                    <div className={styles.formRow2}>
                        <div className={`${styles.column}`}>
                            <Button
                                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"   stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>}
                                onClick={() => {
                                    form.restart();
                                    close();
                                }}
                                small
                                value="default"
                                className={styles.formItemRemove}
                            />
                            <div className={styles.column}>
                                <ReactFinalForm.Field
                                    name="name"
                                    label="Name"
                                    component={InputFieldFF}
                                    type="text"
                                    validate={hasValue}
                                    required
                                />

                            </div>
                            <div className={styles.column}>
                                <ReactFinalForm.Field
                                    name="department"
                                    label="Department"
                                    component={InputFieldFF}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <Button type="submit" primary>
                                Register
                            </Button>

                        </div>
                    </div>
                </div>
            </form>
        )}
    </ReactFinalForm.Form>
}