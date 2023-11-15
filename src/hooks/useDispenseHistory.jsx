import {useDataQuery} from "@dhis2/app-runtime";
import {useState} from "react";

const dispenseHistoryQuery = {
  dispenseHistory: {
      resource: 'dataStore/mikimami/dispenseHistory',
      params: {
          fields: ['dispenseHistory']
      }
  }
}
export const useDispenseHistory = ()=>{
  const [dispenseHistory, setDispenseHistory] = useState(null);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const {loading, error, data, refetch: internalRefetch} = useDataQuery(dispenseHistoryQuery);

  const refetch = () => {
    setRefetchLoading(true)
    internalRefetch()
      .then(value => {
        setDispenseHistory(Object.values(value.dispenseHistory.dispenseHistory));
        setRefetchLoading(false);
      })
  }

  if (refetchLoading && dispenseHistory){
    setDispenseHistory(null);
  }

  if (data && !dispenseHistory && !refetchLoading){
      console.log('useDispenseHistory', data);
      setDispenseHistory(Object.values(data.dispenseHistory.dispenseHistory));
  }
  return {loading: loading || refetchLoading, error, dispenseHistory, refetch};
}