import React from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import { formatDatetime } from "../../utils/formatting";
import * as PropTypes from "prop-types";

export function DispenseHistoryTable({ useDispenseHistory }) {
  const { loading, error, dispenseHistory } = useDispenseHistory;

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <></>;
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
                  <TableCell>{formatDatetime(row.dateDispensed)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

DispenseHistoryTable.propTypes = {
  useDispenseHistory: PropTypes.objectOf(PropTypes.any),
};
