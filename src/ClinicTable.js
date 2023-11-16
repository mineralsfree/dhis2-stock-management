import React, {useState} from "react";
import {CircularLoader} from "@dhis2/ui";
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
import {useNearbyClinics} from "./hooks/useNearbyClinics";

const ClinicTable = (props) => {
  const {selectedCommodity} = props
  const [requestError, setRequestError] = useState(false);
  const {nearbyClinics} = useNearbyClinics();
  if (!nearbyClinics) {
    return <CircularLoader/>
  }
  console.log(nearbyClinics);
  console.log(selectedCommodity);

  const selectedClinics = nearbyClinics.filter(clinics => clinics.displayName === selectedCommodity);
  console.log(selectedClinics);

  return (
    <div style={{flex: 1, marginLeft: "5px"}}>
      <h3> {/*{selectedCommodity.displayName}  */}request from nearby clinics</h3>
      <Table>
        <TableHead>
          <TableRowHead className={styles.category}>
            <TableCellHead>Distance</TableCellHead>
            <TableCellHead>Clinic</TableCellHead>
            <TableCellHead>Stock balance</TableCellHead>
            <TableCellHead>Commodity</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {selectedClinics.map(clincs => {
            return (<TableRow key={clincs.orgUnitName}>
              <TableCell>{clincs.orgUnit}</TableCell>
              <TableCell>{clincs.orgUnitName}</TableCell>
              <TableCell>{clincs.endBalance}</TableCell>
              <TableCell>
                <input type="number" id="tentacles" name="tentacles" min="10" max="100"/>
                <button className="btn btn-primary" type="button">
                  Request
                </button>
              </TableCell>
            </TableRow>)
          })}

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

export {ClinicTable};