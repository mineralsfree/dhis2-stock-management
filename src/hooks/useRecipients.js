import { useDataQuery } from "@dhis2/app-runtime";
import { useState } from "react";

const recipientsQuery = {
  recipients: {
    resource: "dataStore/mikimami/recipients",
    params: {
      fields: ["recipients"],
    },
  },
};
export const useRecipients = () => {
  const [recipients, setRecipients] = useState(null);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const {
    loading,
    error,
    data,
    refetch: internalRefetch,
  } = useDataQuery(recipientsQuery);
  const refetch = () => {
    setRefetchLoading(true);
    internalRefetch().then((value) => {
      setRecipients(Object.values(value.recipients.recipients));
      setRefetchLoading(false);
    });
  };
  if (loading && recipients) {
    setRecipients(null);
  }
  if (data && !recipients) {
    console.log("recipients", data);
    setRecipients(Object.values(data.recipients.recipients));
  }
  return { loading: loading || refetchLoading, error, recipients, refetch };
};
