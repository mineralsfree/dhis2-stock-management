import { useDataQuery } from "@dhis2/app-runtime";
import { useState } from "react";

const deliveryHistoryQuery = {
  deliveryHistory: {
    resource: "dataStore/mikimami/deliveryHistory",
    params: {
      fields: ["deliveryHistory"],
    },
  },
};
export const useDeliveryHistory = () => {
  const [deliveryHistory, setDeliveryHistory] = useState(null);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const {
    loading,
    error,
    data,
    refetch: internalRefetch,
  } = useDataQuery(deliveryHistoryQuery);

  const refetch = () => {
    setRefetchLoading(true);
    internalRefetch().then((value) => {
      setDeliveryHistory(Object.values(value.deliveryHistory.deliveryHistory));
      setRefetchLoading(false);
    });
  };

  if (refetchLoading && deliveryHistory) {
    setDeliveryHistory(null);
  }

  if (data && !deliveryHistory && !refetchLoading) {
    setDeliveryHistory(Object.values(data.deliveryHistory.deliveryHistory));
  }
  return {
    loading: loading || refetchLoading,
    error,
    deliveryHistory,
    refetch,
  };
};
