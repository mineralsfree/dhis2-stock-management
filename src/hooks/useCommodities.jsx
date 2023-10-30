import {useState} from 'react';
import {useDataQuery} from "@dhis2/app-runtime";

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
            orgUnit: "ZpE2POxvl9P"
        }
    }
}
const mergeData = (data) => {
    const retObj = {};
    data.commoditiesSet.dataSetElements.forEach(d => {
        let matchedValue = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id);
        // get longer group (category) and remove "Comodity" prefix
        let category = d.dataElement.dataElementGroups.sort((a, b) => b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '').trim();
        let element = {
            displayName: d.dataElement.name.replace(/Commodities( - )?/, ''),
            id: d.dataElement.id,
            value: matchedValue.value,
            category
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
