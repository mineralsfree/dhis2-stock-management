import React from "react";
import {
  CircularLoader,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  Button,
  Modal,
  ModalTitle,
  ModalContent,
} from "@dhis2/ui";
import { formatDatetime } from "../../utils/formatting";
import { useState } from "react";
import styles from "./Delivery.module.css";
import * as PropTypes from "prop-types";

export function DeliveryHistory({ useDeliveryHistory }) {
  const { loading, error, deliveryHistory } = useDeliveryHistory;
  const [modalInfo, setModalInfo] = useState(null);

  if (loading) {
    return <CircularLoader large />;
  }

  if (!deliveryHistory) {
    return null;
  }

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  // sort deliveryHistory by date
  const deliveryHistorySorted = deliveryHistory.sort((a, b) => {
    return new Date(b.completeDate) - new Date(a.completeDate);
  });

  return (
    <>
      {modalInfo && (
        <Modal onClose={() => setModalInfo(null)} medium position="middle">
          <ModalTitle>Delivery details</ModalTitle>
          <ModalContent>
            <Table>
              <TableHead>
                <TableRowHead>
                  <TableCellHead>Commodity</TableCellHead>
                  <TableCellHead>Quantity arrived</TableCellHead>
                </TableRowHead>
              </TableHead>
              <TableBody>
                {modalInfo.dataValues.map((row, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{row.displayName}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className={styles.deliveryDetailsText}>
              <p>Date of arrival: {formatDatetime(modalInfo.completeDate)}</p>
              <p>Stored by: {modalInfo.storedBy}</p>
            </div>
          </ModalContent>
        </Modal>
      )}
      <h3>Delivery arrival history</h3>
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Date arrived</TableCellHead>
            <TableCellHead>Stored by</TableCellHead>
            <TableCellHead></TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {deliveryHistorySorted.map((row, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{formatDatetime(row.completeDate)}</TableCell>
                <TableCell>{row.storedBy}</TableCell>
                <TableCell>
                  <Button onClick={() => setModalInfo(row)}>
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
DeliveryHistory.propTypes = {
  useDeliveryHistory: PropTypes.objectOf(PropTypes.any),
};
