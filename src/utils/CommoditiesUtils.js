import {END_BALANCE_ID} from "../consts";

export const commoditiesToOptions = (commodities) => {
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
        if (a.label < b.label) {
            return -1;
        }
        return 1;
    });
    return commodityOptions;
}
export const stockBalanceById = (commodityOptions, id) => parseInt(commodityOptions.find((com) => com.value === id).inStock)
export const registerCommodityQuery = {
    dataSet: "ULowA8V3ucd",
    resource: "dataValueSets",
    type: "create",
    data: (values) => ({
        period: "202310",
        orgUnit: "ImspTQPwCqd",
        dataValues: [
            {
                dataElement: values.commodity,
                categoryOptionCombo: END_BALANCE_ID, // End Balance
                value: values.balance.endBalance + Number(values.amount),
                storedBy: values.storedBy
            }]
    })
}