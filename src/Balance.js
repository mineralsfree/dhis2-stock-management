import React, {useState} from "react";
import {useDataQuery} from '@dhis2/app-runtime'
import {CircularLoader} from "@dhis2/ui";
import {ClinicTable} from "./ClinicTable";

import {
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

import styles from './Balance.module.css'
import {ORG_UNIT} from "./consts";

const dataQuery = {
  dataSets: {
    resource: 'dataSets/aLpVgfXiz0f',
    params: {
      fields: [
        'name',
        'id',
        '*',
        'dataSetElements[dataElement[id, displayName]',
      ],
    },
  },
  commoditiesSet: {
    resource: 'dataSets/ULowA8V3ucd',
    params: {
      fields: [
        '*',
        'name',
        'id',
        'dataSetElements[dataElement[name,displayName, id,dataElementGroups[name], categoryCombo[name,id,categoryOptionCombos[name,id, *]]]'
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

const mergeData = (data) => {
  return data.commoditiesSet.dataSetElements.map((d) => {
    let matchedValue = data.commoditiesValue.dataValues.find((dataValues) => {
      if (dataValues.dataElement === d.dataElement.id) {
        return true;
      }
    });
    return {
      displayName: d.dataElement.name.replace(/Commodities( - )?/, ""),
      id: d.dataElement.id,
      value: matchedValue.value,
      // get longer group (category) and remove "Comodity" prefix
      category: d.dataElement.dataElementGroups
        .sort((a, b) => b.name.length - a.name.length)[0]
        .name.replace(/Commodities( - )?/, ""),
    };
  });
};

export function Balance() {
  const [searchWord, setSearchWord] = useState("");
  const [sortArg, setSortArg] = useState("");
  const {loading, error, data} = useDataQuery(dataQuery);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const handleClick = (comodity) => {
    setSelectedCommodity(comodity);
    setShowTable(true);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large/>;
  }

  if (!data) {
    return <h1>Browse</h1>;
  }

  const groupedData = data.commoditiesSet.dataSetElements.reduce((acc, d) => {
    const displayName = d.dataElement.name.replace(/Commodities( - )?/, '');
    const matchedValue = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === "rQLFnNXXIL0");
    const category = d.dataElement.dataElementGroups.sort((a, b) => b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '');

    if (!displayName.toLowerCase().includes(searchWord)) {
      return acc;
    }

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({displayName, value: matchedValue.value, id: d.dataElement.id});

    return acc;
  }, {});

  let sortedCategories = Object.keys(groupedData)

  if (sortArg === "alphCat" || sortArg === "alphAll") {
    sortedCategories = Object.keys(groupedData).sort();
  }

  if (sortArg === "alphCom" || sortArg === "alphAll") {
    Object.keys(groupedData).map((category) => {
      groupedData[category].sort((el1, el2) => el1.displayName.localeCompare(el2.displayName));
    })
  }

  if (sortArg === "stock") {
    Object.keys(groupedData).map((category) => {
      groupedData[category].sort((el1, el2) => el1.value - el2.value);
    })
  }


  return (
    <div>
      <h1>Balance</h1>
      <ButtonStrip className={styles.buttonContainer}>
        <InputField
          name="defaultName"
          onChange={(word) => {
            setSearchWord(word.value)
          }}
          placeholder="Search"
          inputWidth="220px"
          value={searchWord}
        />
        <DropdownButton
          component={<FlyoutMenu>
            <MenuItem label="Alphabetically" onClick={() => setSortArg("alphAll")}/>
            <MenuItem label="Alphabetically After Category" onClick={() => setSortArg("alphCat")}/>
            <MenuItem label="Alphabetically After Commodity" onClick={() => setSortArg("alphCom")}/>
            <MenuItem label="Stock Balance" onClick={() => setSortArg("stock")}/>
            <MenuItem label="Clear Sorting Choice" onClick={() => setSortArg("clear")}/>
          </FlyoutMenu>}
          name="buttonName"
          value="buttonValue"
        >
          Sort
        </DropdownButton>

      </ButtonStrip>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}><Table>
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
                  <TableCell colSpan="3" className={styles.category}>{category}</TableCell>
                </TableRow>
                {groupedData[category].map((row) => (
                  <TableRow  key={row.id} className={styles.tablerow + (selectedCommodity === row.displayName ? ` ${styles.tablerow_active}` : '')}>
                    <TableCell >
                    </TableCell>
                    <TableCell>
                      <button className={styles.tablebtn} onClick={e => handleClick(row.displayName)}>{row.displayName}
                      </button>
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        </div>
        {selectedCommodity && (
          <ClinicTable selectedCommodity={selectedCommodity}/>
        )}
      </div>
    </div>
  );
}
