import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Balance"
        active={props.activePage === "Balance"}
        onClick={() => props.activePageHandler("Balance")}
      />
      <MenuItem
        label="Insert"
        active={props.activePage === "Insert"}
        onClick={() => props.activePageHandler("Insert")}
      />
      <MenuItem
        label="Commodity dispensing"
        active={props.activePage === "Commodity"}
        onClick={() => props.activePageHandler("Commodity")}
      />
      <MenuItem
        label="Delivery"
        active={props.activePage === "Delivery"}
        onClick={() => props.activePageHandler("Delivery")}
      />
      <MenuItem
        label="DeliveryAlt"
        active={props.activePage === "DeliveryAlt"}
        onClick={() => props.activePageHandler("DeliveryAlt")}
      />
    </Menu>
  );
}
