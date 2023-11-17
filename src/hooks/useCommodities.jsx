import {useState} from 'react';
import {useDataQuery} from "@dhis2/app-runtime";
import {CONSUMPTION_ID, END_BALANCE_ID, QUANTITY_ORDERED_ID, ORG_UNIT} from "../consts";

const dataQuery = {
    commoditiesSet: {
        resource: 'dataSets/ULowA8V3ucd',
        params: {
            fields: [
                'name',
                'id',
                'dataSetElements[dataElement[name,displayName, id,dataElementGroups[name], categoryCombo[name,id,categoryOptionCombos[name,id, *]]]'
            ],
        },
    },
    commoditiesValue: {
        resource: 'dataValueSets',
        params: {
            dataSet: 'ULowA8V3ucd',
            period: '202310',
            orgUnit: ORG_UNIT
        }
    }
}
const mergeData = (data) => {
    const retObj = {};
    data.commoditiesSet.dataSetElements.forEach(d => {
        const displayName = d.dataElement.displayName.replace(/Commodities( - )?/, '').trim();
        let endBalance = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === END_BALANCE_ID)?.value;
        endBalance = endBalance ? parseInt(endBalance) : 0;
        let consumption = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === CONSUMPTION_ID)?.value;
        consumption = consumption ? parseInt(consumption) : 0;
        let quantityOrdered = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === QUANTITY_ORDERED_ID)?.value;
        quantityOrdered = quantityOrdered ? parseInt(quantityOrdered) : 0;
        const inStock = endBalance ? parseInt(endBalance) - (consumption ? parseInt(consumption) : 0) : 0;
        // get longer group (category) and remove "Comodity" prefix
        const category = d.dataElement.dataElementGroups.sort((a, b) => b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '').trim();
        const element = {
            displayName: displayName,
            id: d.dataElement.id,
            endBalance: endBalance,
            consumption: consumption,
            quantityOrdered: quantityOrdered,
            inStock: endBalance, // remove
            category: category,
        };
        retObj[category] = retObj[category] ? [...retObj[category], element] : [element];
    })
    return retObj
}


export const useCommodities = () => {
    const [commodities, setCommodities] = useState(null);
    const [refetchLoading, setRefetchLoading] = useState(false);
    const {loading, error, data, refetch: internalRefetch} = useDataQuery(dataQuery);
    const refetch = () => {
        setRefetchLoading(true)
        internalRefetch()
            .then(value => {
                setCommodities(mergeData(value));
                setRefetchLoading(false);
            })
    }
    //in order to refetch to work;
    if (refetchLoading && commodities) {
        setCommodities(null);
    }
    if (data && !commodities && !refetchLoading) {
        setCommodities(mergeData(data));
    }
    
    return {loading: loading || refetchLoading, error, commodities, refetch};

}
