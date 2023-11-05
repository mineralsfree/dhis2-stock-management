import React, {useState} from "react";
import {useDataQuery} from '@dhis2/app-runtime'
import {CircularLoader} from "@dhis2/ui";
import "../../styles.css";
import styles from './CommodityDeliveryRegistration.module.css';
import {
    DropdownButton,
    FlyoutMenu,
    Input,
    MenuItem,
    Button
} from '@dhis2/ui'
import {CommoditySelect} from "../common/CommoditySelect/CommoditySelect";
import {useCommodities} from "../../hooks/useCommodities";
import {InputWrapper} from "../common/InputWrapper/InputWrapper";

export const CommodityDeliveryRegistration = (props) => {
    const {user} = props;
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [amount, setAmount] = useState('0');
    const [time, setTime] = useState(new Date().toTimeString().slice(0,5))
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const {loading, error, commodities} = useCommodities();
    console.log(user);
    const handleDateChange = (event) => {
        setDate(event);
    };
    const handleTimeChange = (event)=>{
        setTime(event)
    }
    const handleAmountChange = (event) => {

    }

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large/>
    }

    if (commodities) {
        return (
            <div>
                <form className={styles.form}>
                    <div className={styles.form_column_container}>
                        <div className={styles.form_column}>
                            <InputWrapper label='Commodities'>
                                <CommoditySelect
                                    options={commodities}
                                    setSelectedCommodity={setSelectedCommodity}
                                    selectedCommodity={selectedCommodity}/>
                            </InputWrapper>
                            <InputWrapper label='Amount'>
                                <Input
                                    type="number"
                                    name="amount"
                                    min={'0'}
                                    className={styles.amount_input}
                                    value={amount}
                                    onChange={e => setAmount(e.value)}
                                />
                            </InputWrapper>
                            <InputWrapper label={'Dispensed by'}>
                                <Input value={user.name} type={'text'} disabled/>
                            </InputWrapper>
                        </div>
                        <div className={styles.form_column}>

                            <InputWrapper label='Date'>
                                <input type="date"
                                       name="date"
                                       value={date}
                                       className={styles.date_input}
                                       onChange={e => handleDateChange(e.target.value)}/>
                            </InputWrapper>
                            <InputWrapper label='Time'>
                                <input type="time"
                                       name="time"
                                       value={time}
                                       className={styles.time_input}
                                       onChange={e => handleTimeChange(e.target.value)}/>
                            </InputWrapper>
                        </div>
                    </div>
                    <div className="form-button">
                        <Button
                            name="Basic button"
                            onClick={handleDateChange}
                            value="default"
                        >
                            Add
                        </Button>
                    </div>
                </form>
                <h2>Delivery registry</h2>

            </div>
        )
    }
}