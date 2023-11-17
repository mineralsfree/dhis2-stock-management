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
  Tooltip,
  IconInfo24,
 
} from "@dhis2/ui";
import { formatDatetime } from "./utils/formatting";
import { useCommodities } from "./hooks/useCommodities";
import { useDispenseHistory } from "./hooks/useDispenseHistory";
import CommodityDispenseForm from "./components/CommodityDispense/CommodityDispenseForm";
import toast, { Toaster } from "react-hot-toast";
import {ORG_UNIT} from "./consts";
import styles from './Commodity.module.css'

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

export function Commodity() {
  const [mutateCommodities] = useDataMutation(dataMutationQuery);
  const [mutateHistory] = useDataMutation(dispenseHistoryMutationQuery);

  const useHistory = useDispenseHistory();

  const handleSubmit = async (formInput) => {
    console.log("formInput", formInput.data);

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
       <div className={styles.stripe}>
            <h1>Register Dispens of Commodities</h1>
            <Tooltip className={styles.info}
                        content="This page allows you to easily record the dispensing of commodities using the form below. You can also register new recipients, and the table beneath the form displays the dispensing history."
                        placement="right">
                    < IconInfo24/>
              </Tooltip>
        </div> 
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

    <div>
      
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
                  <TableCell>{formatDatetime(row.dateDispensed)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>

    </div>
  );
}
