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
  Button,
} from "@dhis2/ui";
import {useNearbyClinics} from "./hooks/useNearbyClinics";
import * as PropTypes from "prop-types";
import toast from "react-hot-toast";

function Input(props) {
  return null;
}

Input.propTypes = {name: PropTypes.string};
const ClinicTable = (props) => {
  const {selectedCommodity} = props
  const [requestError, setRequestError] = useState(false);
  const {nearbyClinics} = useNearbyClinics();
  if (!nearbyClinics) {
    return <CircularLoader/>
  }

  const selectedClinics = nearbyClinics.filter(clinics => clinics.displayName === selectedCommodity);
  return (
    <div style={{flex: 1, marginLeft: "5px"}}>
      <h3> {selectedCommodity} request from nearby clinics</h3>
      <Table>
        <TableHead>
          <TableRowHead className={styles.category}>
            {/*<TableCellHead>OrganisationUnit id</TableCellHead>*/}
            <TableCellHead>Clinic</TableCellHead>
            <TableCellHead>Stock balance</TableCellHead>
            <TableCellHead>Request</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {selectedClinics.map(clincs => {
            return (<TableRow key={clincs.orgUnitName}>
              {/*<TableCell>{clincs.orgUnit}</TableCell>*/}
              <TableCell>{clincs.orgUnitName}</TableCell>
              <TableCell>{clincs.endBalance}</TableCell>
              <TableCell>
                <Input type='number' name="req" />
                <Button primary onClick={()=>toast.success(`Requested ${selectedCommodity} from ${clincs.orgUnitName}`)}>
                  Request
                </Button>
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