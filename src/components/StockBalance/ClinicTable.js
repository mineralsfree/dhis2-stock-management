import React from "react";
import { CircularLoader } from "@dhis2/ui";
import styles from "./Balance.module.css";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  Button,
} from "@dhis2/ui";
import { useNearbyClinics } from "../../hooks/useNearbyClinics";
import * as PropTypes from "prop-types";
import toast from "react-hot-toast";

const ClinicTable = (props) => {
  const { selectedCommodity, unselectCommodity } = props;
  const { nearbyClinics } = useNearbyClinics();
  if (!nearbyClinics) {
    return <CircularLoader />;
  }

  const selectedClinics = nearbyClinics.filter(
    (clinics) => clinics.displayName === selectedCommodity,
  );
  return (
    <div style={{ flex: 1, marginLeft: "5px" }}>
      <div className={styles.headingRow}>
        <h3>
          Request <b>{selectedCommodity}</b> from nearby clinics
        </h3>
        <Button secondary onClick={() => unselectCommodity()}>
          Cancel
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRowHead className={styles.category}>
            <TableCellHead>Clinic</TableCellHead>
            <TableCellHead>Stock balance</TableCellHead>
            <TableCellHead>Request</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {selectedClinics.map((clincs) => {
            return (
              <TableRow key={clincs.orgUnitName}>
                <TableCell>{clincs.orgUnitName}</TableCell>
                <TableCell>{clincs.endBalance}</TableCell>
                <TableCell className={styles.requestCell}>
                  <span>Amount:</span>
                  <Input
                    className={styles.requestInput}
                    type="number"
                    name="req"
                    max={clincs.endBalance}
                  />
                  <Button
                    primary
                    onClick={() =>
                      toast.success(
                        `Requested ${selectedCommodity} from ${clincs.orgUnitName}`,
                      )
                    }
                  >
                    Request
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
ClinicTable.propTypes = {
  selectedCommodity: PropTypes.object,
  unselectCommodity: PropTypes.func,
};

export { ClinicTable };
