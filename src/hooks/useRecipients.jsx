import {useDataQuery} from "@dhis2/app-runtime";
import {useState} from "react";

const recipientsQuery = {
    recipients: {
        resource: 'dataStore/mikimami/recipients',
        params: {
            fields: ['recipients']
        }
    }
}
export const useRecipients = ()=>{
    const [recipients, setRecipients] = useState(null);
    const {loading, error, data, refetch} = useDataQuery(recipientsQuery);
    if (loading && recipients){
        setRecipients(null);
    }
    if (data && !recipients){
        console.log('data',data);
        setRecipients(Object.values(data.recipients.recipients));
    }
    return {loading, error, recipients, refetch};
}