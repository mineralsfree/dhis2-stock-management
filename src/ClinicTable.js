import React, { useState } from "react";
import { CircularLoader } from "@dhis2/ui";
import styles from './Balance.module.css';

import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";

const ClinicTable = () => {
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [requestError, setRequestError] = useState(false);

  const handleRequestClick = () => {
    if (selectedCommodity) {
      alert(`{/*{selectedCommodity.value}  */}  {/*{selectedCommodity.displayName}  */} is requested`);
    } else {
      setRequestError(true);
    }
  };



  return (
    <div style={{ flex: 1, marginLeft: "5px" }}>
      <h3> {/*{selectedCommodity.displayName}  */}request from nearby clinics</h3>
      <Table>
        <TableHead>
          <TableRowHead className={styles.category} >
            <TableCellHead>Distance</TableCellHead>
            <TableCellHead>Clinic</TableCellHead>
            <TableCellHead>Stock balance</TableCellHead>
            <TableCellHead>Commodity</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{/* Distance */}</TableCell>
            <TableCell>{/* Clinic name */}</TableCell>
            <TableCell>{/* /}{selectedCommodity.value}  */}</TableCell>
            <TableCell>
              <input
                type="number"
                id="tentacles"
                name="tentacles"
                min="10"
                max="100"
              />

              <button
                className="btn btn-primary"
                type="button"
                onClick={handleRequestClick}
              >
                Request
              </button>

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {requestError && (
        <div className="error-message">
          Please choose a number of commodity before making a request.
        </div>
      )}
    </div>
  );
};

export { ClinicTable };