import {useState} from 'react';
import {useDataQuery} from "@dhis2/app-runtime";

const END_BALANCE_ID = "rQLFnNXXIL0"
const CONSUMPTION_ID = "J2Qf1jtZuj8"

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
            orgUnit: "ImspTQPwCqd"
        }
    }
}
const mergeData = (data) => {
    const retObj = {};
    console.log("oooo");
    console.log(data);
    data.commoditiesSet.dataSetElements.forEach(d => {
        const displayName = d.dataElement.displayName.replace(/Commodities( - )?/, '').trim();
        let endBalance = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === END_BALANCE_ID)?.value;
        endBalance = endBalance ? parseInt(endBalance) : 0;
        let consumption = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === CONSUMPTION_ID)?.value;
        console.log("consumption", displayName, consumption);
        consumption = consumption ? parseInt(consumption) : 0;
        // const category = d.dataElement.dataElementGroups[0].name.replace(/Commodities( - )?/, '').trim();
        const inStock = endBalance ? parseInt(endBalance) - (consumption ? parseInt(consumption) : 0) : 0;
        // get longer group (category) and remove "Comodity" prefix
        const category = d.dataElement.dataElementGroups.sort((a, b) => b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '').trim();
        const element = {
            displayName: displayName,
            id: d.dataElement.id,
            endBalance: endBalance,
            consumption: consumption,
            inStock: inStock,
            category: category,
        };
        retObj[category] = retObj[category] ? [...retObj[category], element] : [element];
    })
    return retObj
}


export const useCommodities = () => {
    const [commodities, setCommodities] = useState(null);
    const {loading, error, data, refetch} = useDataQuery(dataQuery)
    //in order to refetch to work;
    if (loading && commodities){
        setCommodities(null);
    }
    if (data && !commodities) {
        setCommodities(mergeData(data));
    }
    return {loading, error, commodities, refetch};

}