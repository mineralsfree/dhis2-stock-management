import React from "react";
import { useDataMutation } from "@dhis2/app-runtime";
import { useDispenseHistory } from "../../hooks/useDispenseHistory";
import { PageHeading } from "../PageHeading/PageHeading";
import CommodityDispenseForm from "./CommodityDispenseForm";
import { DispenseHistoryTable } from "./DispenseHistoryTable";
import toast, { Toaster } from "react-hot-toast";
import { ORG_UNIT } from "../../consts";

const dataMutationQuery = {
  dataSet: "ULowA8V3ucd",
  resource: "dataValueSets",
  type: "create",
  completeDate: ({ completeDate }) => completeDate,
  data: ({ dataValues }) => ({
    period: "202310",
    orgUnit: ORG_UNIT,
    dataValues: dataValues.map((dataValue) => ({
      dataElement: dataValue.dataElement,
      categoryOptionCombo: dataValue.categoryOptionCombo, // consumption
      value: dataValue.value,
    })),
  }),
};

const dispenseHistoryMutationQuery = {
  resource: "dataStore/mikimami/dispenseHistory",
  type: "update",
  data: ({ dispenseHistory }) => ({
    dispenseHistory: dispenseHistory,
  }),
};

export function CommodityDispense() {
  const [mutateCommodities] = useDataMutation(dataMutationQuery);
  const [mutateHistory] = useDataMutation(dispenseHistoryMutationQuery);

  const useHistory = useDispenseHistory();

  const handleSubmit = async (formInput) => {
    console.log("formInput", formInput.data);
    console.log(useHistory?.dispenseHistory);

    const dataValues = [];
    formInput.data.forEach((item) => {
      // update consumption
      dataValues.push({
        dataElement: item.dataElement,
        value: item.currentConsumption + item.amount,
        categoryOptionCombo: "J2Qf1jtZuj8", // consumption
      });

      // update end balance
      dataValues.push({
        dataElement: item.dataElement,
        value: item.currentEndBalance - item.amount,
        categoryOptionCombo: "rQLFnNXXIL0", // endBalance
      });
    });

    const promises = [
      mutateCommodities({
        completeDate: formInput.dateDispensed,
        dataValues: dataValues,
      }),
      mutateHistory({
        dispenseHistory: [
          ...(useHistory?.dispenseHistory || []),
          ...formInput.data.map((item) => {
            const completeDate = `${formInput.dateDispensed}T${formInput.timeDispensed}:00.000`;
            return {
              dataElement: item.dataElement,
              quantityDispensed: item.amount.toString(),
              displayName: item.displayName,
              dispensedBy: formInput.dispensedBy,
              dispensedTo: formInput.dispensedTo,
              dateDispensed: completeDate,
            };
          }),
        ],
      }),
    ];

    await Promise.all(promises)
      .then(() => {
        // success, refetch dispense history
        useHistory.refetch();
        toast.success("Successfully registered commodity dispense", {
          duration: 4000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error registering commodity dispense", {
          duration: 4000,
        });
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "15px",
      }}
    >
      <Toaster />
      <PageHeading
        title="Register Dispense of Commodities"
        variant="h2"
        content="This page allows you to easily record the dispensing of commodities using the form below. You can also register new recipients, and the table beneath the form displays the dispensing history."
      />
      <CommodityDispenseForm handleRegister={handleSubmit} />
      <DispenseHistoryTable useDispenseHistory={useHistory} />
    </div>
  );
}
