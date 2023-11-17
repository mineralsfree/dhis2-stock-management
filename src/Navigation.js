import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

const activeStyle = {
  backgroundColor: "#f0f0f0",
};

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Stock Balance"
        active={props.activePage === "Balance"}
        onClick={() => props.activePageHandler("Balance")}
        style={props.activePage === "Balance" ? activeStyle : null}

      />
     
      <MenuItem
            label="Dispensing Commodity"
            active={props.activePage === "Commodity"}
            onClick={() => props.activePageHandler("Commodity")}
            style={props.activePage === "Balance" ? activeStyle : null}

        />
        <MenuItem
            label="Register Delivery"
            active={props.activePage === "Delivery"}
            onClick={() => props.activePageHandler("Delivery")}
            style={props.activePage === "Delivery" ? activeStyle : null}
            />
    </Menu>
  );
}
