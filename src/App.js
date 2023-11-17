import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { CommodityDispense } from "./components/CommodityDispense/CommodityDispense";
import { Balance } from "./components/StockBalance/Balance";
import { CircularLoader } from "@dhis2/ui";
import { Toaster } from "react-hot-toast";
import { Navigation } from "./Navigation";
import { useDataQuery } from "@dhis2/app-runtime";
import { DeliveryPage } from "./components/Delivery/DeliveryPage";

const query = {
  me: {
    resource: "me",
    params: {
      fields: ["id", "name", "organisationUnits"],
    },
  },
};
function MyApp() {
  const [activePage, setActivePage] = useState("Balance");
  const { data, loading, error } = useDataQuery(query);
  function activePageHandler(page) {
    setActivePage(page);
  }
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }
  if (loading) {
    return <CircularLoader large />;
  }
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.right}>
        {activePage === "Balance" && <Balance />}
        {/*    {activePage === "Insert" && <Insert/>}*/}
        {activePage === "Commodity" && <CommodityDispense />}
        {activePage === "Delivery" && <DeliveryPage user={data.me} />}
      </div>
      <Toaster />
    </div>
  );
}

export default MyApp;
