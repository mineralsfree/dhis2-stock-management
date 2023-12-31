import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { ClinicTable } from "./ClinicTable";

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  DropdownButton,
  InputField,
  ButtonStrip,
  FlyoutMenu,
  MenuItem,
} from "@dhis2/ui";

import styles from "./Balance.module.css";
import { ORG_UNIT } from "../../consts";
import { PageHeading } from "../PageHeading/PageHeading";
import { InfoBox } from "../InfoBox/InfoBox";

const dataQuery = {
  dataSets: {
    resource: "dataSets/aLpVgfXiz0f",
    params: {
      fields: [
        "name",
        "id",
        "*",
        "dataSetElements[dataElement[id, displayName]",
      ],
    },
  },
  commoditiesSet: {
    resource: "dataSets/ULowA8V3ucd",
    params: {
      fields: [
        "*",
        "name",
        "id",
        "dataSetElements[dataElement[name,displayName, id,dataElementGroups[name], categoryCombo[name,id,categoryOptionCombos[name,id, *]]]",
      ],
    },
  },

  dataValueSets: {
    resource: "dataValueSets",
    params: {
      orgUnit: ORG_UNIT,
      dataSet: "aLpVgfXiz0f",
      period: "2020",
    },
  },
  commoditiesValue: {
    resource: "dataValueSets",
    params: {
      dataSet: "ULowA8V3ucd",
      period: "202310",
      orgUnit: ORG_UNIT,
    },
  },
};

export function Balance() {
  const [searchWord, setSearchWord] = useState("");
  const [sortArg, setSortArg] = useState("alphAll");
  const { loading, error, data } = useDataQuery(dataQuery);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const handleClick = (commodity) => {
    if (selectedCommodity === commodity) {
      setSelectedCommodity(null);
      return;
    }
    setSelectedCommodity(commodity);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (!data) {
    return <h1>Browse</h1>;
  }

  const groupedData = data.commoditiesSet.dataSetElements.reduce((acc, d) => {
    const displayName = d.dataElement.name.replace(/Commodities( - )?/, "");
    const matchedValue = data.commoditiesValue.dataValues.find(
      (dataValues) =>
        dataValues.dataElement === d.dataElement.id &&
        dataValues.categoryOptionCombo === "rQLFnNXXIL0"
    );
    const category = d.dataElement.dataElementGroups
      .sort((a, b) => b.name.length - a.name.length)[0]
      .name.replace(/Commodities( - )?/, "");

    if (!displayName.toLowerCase().includes(searchWord.toLowerCase())) {
      return acc;
    }

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({
      displayName,
      value: matchedValue.value,
      id: d.dataElement.id,
    });

    return acc;
  }, {});

  let sortedCategories = Object.keys(groupedData);

  if (sortArg === "alphCat" || sortArg === "alphAll") {
    sortedCategories = Object.keys(groupedData).sort();
  }

  if (sortArg === "alphCom" || sortArg === "alphAll") {
    Object.keys(groupedData).map((category) => {
      groupedData[category].sort((el1, el2) =>
        el1.displayName.localeCompare(el2.displayName)
      );
    });
  }

  if (sortArg === "stock") {
    Object.keys(groupedData).map((category) => {
      groupedData[category].sort((el1, el2) => el1.value - el2.value);
    });
  }

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
        title="Stock Balance"
        variant="h2"
        content="This page presents a tabulated overview of all commodities with their corresponding stock levels. When clicking on a commodity, the stock levels of nearby clinics are revealed, allowing you to request commodities from these clinics."
      />
      <InfoBox
        id={"balance-info-box"}
        title="How to request Commodities"
        text="When clicking on a commodity, the stock levels of nearby clinics are revealed, allowing you to request commodities from these clinics."
      ></InfoBox>
      <Card>
        <div style={{ padding: "24px" }}>
          <ButtonStrip className={styles.buttonContainer}>
            <InputField
              name="defaultName"
              onChange={(word) => {
                setSearchWord(word.value);
              }}
              placeholder="Search"
              inputWidth="220px"
              value={searchWord}
            />
            <DropdownButton
              component={
                <FlyoutMenu>
                  <MenuItem
                    label="Alphabetically"
                    onClick={() => setSortArg("alphAll")}
                  />
                  <MenuItem
                    label="Alphabetically After Category"
                    onClick={() => setSortArg("alphCat")}
                  />
                  <MenuItem
                    label="Alphabetically After Commodity"
                    onClick={() => setSortArg("alphCom")}
                  />
                  <MenuItem
                    label="Stock Balance"
                    onClick={() => setSortArg("stock")}
                  />
                </FlyoutMenu>
              }
              name="buttonName"
              value="buttonValue"
            >
              Sort
            </DropdownButton>
          </ButtonStrip>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <Table>
                <TableHead>
                  <TableRowHead>
                    <TableCellHead>Category</TableCellHead>
                    <TableCellHead>Commodity</TableCellHead>
                    <TableCellHead>Stock balance</TableCellHead>
                  </TableRowHead>
                </TableHead>

                <TableBody>
                  {sortedCategories.map((category) => (
                    <React.Fragment key={category}>
                      <TableRow>
                        <TableCell colSpan="3" className={styles.category}>
                          {category}
                        </TableCell>
                      </TableRow>
                      {groupedData[category].map((row) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,react/jsx-key
                        <div
                          className={styles.tableRowWrapper}
                          onClick={() => handleClick(row.displayName)}
                          key={row.id}
                        >
                          <TableRow
                            key={row.id}
                            className={
                              styles.tablerow +
                              (selectedCommodity === row.displayName
                                ? ` ${styles.tablerow_active}`
                                : "")
                            }
                          >
                            <TableCell></TableCell>
                            <TableCell>{row.displayName}</TableCell>
                            <TableCell>{row.value}</TableCell>
                          </TableRow>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
            {selectedCommodity && (
              <ClinicTable
                selectedCommodity={selectedCommodity}
                unselectCommodity={() => setSelectedCommodity(null)}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
