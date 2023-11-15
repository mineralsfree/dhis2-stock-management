import React from "react";
import { useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import "./styles.css";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import { useCommodities } from "./hooks/useCommodities";
import { useDispenseHistory } from "./hooks/useDispenseHistory";
import CommodityDispenseForm from "./components/CommodityDispense/CommodityDispenseForm";

const dataMutationQuery = {
  dataSet: "ULowA8V3ucd",
  resource: "dataValueSets",
  type: "create",
  completeDate: ({ completeDate }) => completeDate,
  data: ({ dataValues }) => ({
    period: "202310",
    orgUnit: "ImspTQPwCqd",
    dataValues: dataValues.map((dataValue) => ({
      dataElement: dataValue.dataElement,
      categoryOptionCombo: "J2Qf1jtZuj8", // consumption
      value: dataValue.value,
      storedBy: "johnabel", // can be ignored?
      comment: "test2",
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

export function Commodity() {
  const [mutateCommodities, { loadingCommodities, errorCommodities }] =
    useDataMutation(dataMutationQuery);
  const [mutateHistory, { loadingHistory, errorHistory }] = useDataMutation(
    dispenseHistoryMutationQuery
  );

  const useHistory = useDispenseHistory();

  const handleSubmit = (formInput) => {
    console.log("formInput", formInput.dataValues);

    const promises = [
      mutateCommodities({
        completeDate: formInput.dateDispensed,
        dataValues: formInput.dataValues,
      }),
      mutateHistory({
        dispenseHistory: [
          ...(useHistory?.dispenseHistory || []),
          ...formInput.dataValues.map((dataValue) => {
            const completeDate = `${formInput.dateDispensed}T${formInput.timeDispensed}:00.000`;
            return {
              dataElement: dataValue.dataElement,
              quantityDispensed: dataValue.valueRaw,
              displayName: dataValue.displayName,
              dispensedBy: formInput.dispensedBy,
              dispensedTo: formInput.dispensedTo,
              dateDispensed: completeDate,
            };
          }),
        ],
      }),
    ];

    Promise.all(promises)
      .then((res) => {
        // success, refetch dispense history
        useHistory.refetch();
        // TODO: notify user of success with toast
      })
      .catch((error) => {
        console.log(error);
        // TODO: notify user of error with toast
      });
  };

  return (
    <div>
      <CommodityDispenseForm handleRegister={handleSubmit} />
      <DispenseHistoryTable useDispenseHistory={useHistory} />
    </div>
  );
}

function DispenseHistoryTable({ useDispenseHistory }) {
  const { loading, error, dispenseHistory, refetch } = useDispenseHistory;

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (!dispenseHistory) {
    return null;
  }

  // sort dipenseHistory by date
  const dispenseHistorySorted = dispenseHistory.sort((a, b) => {
    return new Date(b.dateDispensed) - new Date(a.dateDispensed);
  });

  return (
    <>
      <h2>Commodity dispense history</h2>
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Commodity</TableCellHead>
            <TableCellHead>Quantity dispensed</TableCellHead>
            <TableCellHead>Dispensed by</TableCellHead>
            <TableCellHead>Dispensed to</TableCellHead>
            <TableCellHead>Date</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {dispenseHistorySorted.map((row, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{row.displayName}</TableCell>
                <TableCell>{row.quantityDispensed}</TableCell>
                <TableCell>{row.dispensedBy}</TableCell>
                <TableCell>{row.dispensedTo}</TableCell>
                <TableCell>{row.dateDispensed}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
