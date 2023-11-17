import React from "react";
import {
    CircularLoader,
    hasValue,
    ReactFinalForm,
    composeValidators,
    InputFieldFF,
    Card,
    SingleSelectFieldFF,
    Tooltip,
    IconInfo24
} from "@dhis2/ui";
import "../../styles.css";
import styles from './CommodityDeliveryRegistration.module.css';
import {
    Button
} from '@dhis2/ui'
import {useCommodities} from "../../hooks/useCommodities";
import {commoditiesToOptions, registerCommodityQuery, stockBalanceById} from "../../utils/CommoditiesUtils";
import {useDataMutation} from "@dhis2/app-runtime";
import toast, {Toaster} from "react-hot-toast";

export const CommodityDeliveryRegistrationPage = (props) => {
    const [mutate] = useDataMutation(registerCommodityQuery);
    const onSubmit = (values) => {
        mutate(values)
    }

    const {user} = props;
    const {loading, error, commodities, refetch} = useCommodities();
    if (loading) {
        return <CircularLoader large/>
    }
    if (!commodities) {
        return null;
    }
    if (error) {
        return <span>ERROR: {error.message}</span>
    }
    const commodityOptions = commoditiesToOptions(commodities);
    const stockBalance = (id) => stockBalanceById(commodityOptions, id);
    if (commodities) {
        return (
            <div>
                 <div className={styles.stripe}>
                    <h1>Register Commodity Arrival</h1>
                    <Tooltip className={styles.info}
                        content="This page enables you to register incoming commodities, either in bulk or individually. Below, you can view the delivery history."
                        placement="right">
                    < IconInfo24/>
              </Tooltip>
        </div> 
            <div className={styles.form}>
                <Card className={styles.card}>
                   {/*} <h3>Register commodity arrival</h3>*/}
                    <ReactFinalForm.Form
                        initialValues={{storedBy: user.name}}
                        className={styles.form}
                                         onSubmit={(values) => {
                        onSubmit({...values, balance: commodityOptions.find((com) => com.value === values.commodity)});
                    }}>
                        {({values, handleSubmit, form}) => (
                            <form onSubmit={(event)=>{
                                handleSubmit(event);
                                toast.success(`Successfully added ${values.amount} of ${values.commodity} to balance`);
                                refetch();
                                form.restart();

                            }}>
                                <div className={styles.formRow}>
                                    <ReactFinalForm.Field
                                        name="storedBy"
                                        label="stored by"
                                        component={SingleSelectFieldFF}
                                        options={[{label: user.name, value: user.name}]}
                                        validate={hasValue}
                                        required
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <ReactFinalForm.Field
                                        name="commodity"
                                        label="Commodity"
                                        helpText={`In stock: ${
                                            values[`commodity`]
                                                ? stockBalance(values[`commodity`])
                                                : ""
                                        }`}
                                        component={SingleSelectFieldFF}
                                        options={commodityOptions}
                                        validate={hasValue}
                                    />
                                    <ReactFinalForm.Field
                                        name="amount"
                                        label="Amount"
                                        component={InputFieldFF}
                                        type="number"
                                        validate={composeValidators(hasValue)}
                                        required
                                    />
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
                </Card>
                <Toaster></Toaster>
            </div>

            </div>
        )
    }
}
