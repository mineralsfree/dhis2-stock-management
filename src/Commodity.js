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
  Card,
} from "@dhis2/ui";
import { useCommodities } from "./hooks/useCommodities";
import { useDispenseHistory } from "./hooks/useDispenseHistory";
import CommodityDispenseForm from "./components/CommodityDispense/CommodityDispenseForm";
import toast, { Toaster } from "react-hot-toast";

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
    <Card>
      <div style={{ padding: "24px" }}>
        <h3>Commodity dispense history</h3>
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
                  <TableCell>
                    {new Date(row.dateDispensed).toLocaleString("no-NB", {
                      timeZone: "CET",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
