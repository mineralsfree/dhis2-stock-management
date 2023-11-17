import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";
import * as PropTypes from "prop-types";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Stock Balance"
        active={props.activePage === "Balance"}
        onClick={() => props.activePageHandler("Balance")}
      />
      <MenuItem
        label="Dispensing Commodity"
        active={props.activePage === "Commodity"}
        onClick={() => props.activePageHandler("Commodity")}
      />
      <MenuItem
        label="Delivery"
        active={props.activePage === "Delivery"}
        onClick={() => props.activePageHandler("Delivery")}
      />
      <MenuItem
        label="Register Delivery Alt"
        active={props.activePage === "DeliveryAlt"}
        onClick={() => props.activePageHandler("DeliveryAlt")}
      />
    </Menu>
  );
}
Navigation.propTypes = {
  activePage: PropTypes.string,
  activePageHandler: PropTypes.func,
};
