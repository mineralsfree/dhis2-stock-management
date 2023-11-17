import React from "react";
import { useState } from "react";
import { Card, TabBar, Tab } from "@dhis2/ui";
import { BulkDeliveryForm } from "./BulkDeliveryForm";
import { IndividualDeliveryForm } from "./IndividualDeliveryForm";
import { DeliveryHistory } from "./DeliveryHistory";
import { useDataMutation } from "@dhis2/app-runtime";
import { useDeliveryHistory } from "../../hooks/useDeliveryHistory";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import { PageHeading } from "../PageHeading/PageHeading";
import { ORG_UNIT } from "../../consts";

const dataMutationQuery = {
  dataSet: "ULowA8V3ucd",
  resource: "dataValueSets",
  type: "create",
  completeDate: ({ completeDate }) => completeDate,
  data: ({ dataValues }) => ({
    period: "202310",
    orgUnit: ORG_UNIT,
    dataValues: dataValues.map((dataValue) => ({
      dataElement: dataValue.dataElement,
      categoryOptionCombo: "rQLFnNXXIL0", // endBalance
      value: dataValue.newBalance,
    })),
  }),
};

const deliveryHistoryMutationQuery = {
  resource: "dataStore/mikimami/deliveryHistory",
  type: "update",
  data: ({ deliveryHistory }) => ({
    deliveryHistory: deliveryHistory,
  }),
};

export function DeliveryPage({ user }) {
  const [mutateCommodities] = useDataMutation(dataMutationQuery);
  const [mutateHistory] = useDataMutation(deliveryHistoryMutationQuery);
  const deliveryHistory = useDeliveryHistory();
  const [selectedTab, setSelectedTab] = useState("bulk");

  const registerDelivery = async (input) => {
    const completeDate = `${input.completeDate}:00.000`;

    const historyDataValues = input.dataValues.map((dataValue) => ({
      dataElement: dataValue.dataElement,
      displayName: dataValue.displayName,
      quantity: dataValue.quantityOrdered,
    }));

    const promises = [
      mutateCommodities({
        completeDate: completeDate,
        dataValues: input.dataValues,
      }),
      mutateHistory({
        deliveryHistory: [
          ...(deliveryHistory?.deliveryHistory || []),
          {
            storedBy: input.storedBy,
            completeDate: completeDate,
            dataValues: historyDataValues,
          },
        ],
      }),
    ];

    await Promise.all(promises)
      .then(() => {
        toast.success("Delivery registered", {
          duration: 4000,
        });
        deliveryHistory.refetch();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error registering delivery", {
          duration: 4000,
        });
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "15px",
      }}
    >
      <PageHeading
        variant="h2"
        title="Register Commodity Arrival"
        content="This page enables you to register incoming commodities, either in bulk or individually. Below, you can view the delivery history."
      />
      <Toaster />
      <Card>
        <div style={{ padding: "24px" }}>
          <TabBar>
            <Tab
              selected={selectedTab === "bulk"}
              onClick={() => setSelectedTab("bulk")}
            >
              {" "}
              Bulk delivery
            </Tab>
            <Tab
              selected={selectedTab === "individual"}
              onClick={() => setSelectedTab("individual")}
            >
              Individual delivery
            </Tab>
          </TabBar>
          {selectedTab === "bulk" && (
            <BulkDeliveryForm user={user} registerDelivery={registerDelivery} />
          )}
          {selectedTab === "individual" && (
            <IndividualDeliveryForm
              user={user}
              registerDelivery={registerDelivery}
            />
          )}
        </div>
      </Card>
      <Card>
        <div style={{ padding: "24px" }}>
          <DeliveryHistory useDeliveryHistory={deliveryHistory} />
        </div>
      </Card>
    </div>
  );
}
DeliveryPage.propTypes = {
  user: PropTypes.string,
};
