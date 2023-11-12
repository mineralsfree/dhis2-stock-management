
import React, { useState } from "react";
import {useDataQuery} from '@dhis2/app-runtime'
import {CircularLoader} from "@dhis2/ui";


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
      orgUnit: "ImspTQPwCqd",
      dataSet: "aLpVgfXiz0f",
      period: "2020",
    },
  },
  commoditiesValue: {
    resource: "dataValueSets",
    params: {
      dataSet: "ULowA8V3ucd",
      period: "202310",
      orgUnit: "ImspTQPwCqd",
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
    const { loading, error, data } = useDataQuery(dataQuery);
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [showSlideLeftPage, setShowSlideLeftPage] = useState(false);

    const handleTableRowClick = (row) => {
      setSelectedCommodity(row);
      setShowSlideLeftPage(true);
    };
    if (error) {
        return <span>ERROR: {error.message}</span>;
    }
    console.log("showSlideLeftPage:", showSlideLeftPage);
    console.log("selectedCommodity:", selectedCommodity);


    if (loading) {
        return <CircularLoader large />;
    }

    if (data) {
        const groupedData = data.commoditiesSet.dataSetElements.reduce((acc, d) => {
            const displayName = d.dataElement.name.replace(/Commodities( - )?/, '');
            const matchedValue = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id && dataValues.categoryOptionCombo === "rQLFnNXXIL0") ;
            const category = d.dataElement.dataElementGroups.sort((a, b) => b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '');


          if(!displayName.toLowerCase().includes(searchWord)){
            return acc;
          }
            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push({ displayName, value: matchedValue.value, id: d.dataElement.id });

            return acc;
        }, {});
      let sortedCategories = Object.keys(groupedData)

      if (sortArg === "alphCat" || sortArg === "alphAll"){
        sortedCategories = Object.keys(groupedData).sort();
      }

      if(sortArg === "alphCom" || sortArg === "alphAll"){
        Object.keys(groupedData).map((category) => {
          groupedData[category].sort((el1, el2) => el1.displayName.localeCompare(el2.displayName));
        })
      }

      if(sortArg === "stock"){
        Object.keys(groupedData).map((category) => {
          groupedData[category].sort((el1, el2) => el1.value - el2.value);
        })
      }

      return (
          <div style={{ display: 'flex', justifyContent: 'space-between' , cursor: 'pointer' }}>
            <ButtonStrip class="button-container">

              <InputField
                name="defaultName"
                onChange={(word) => {setSearchWord(word.value)}}
                placeholder="Search"
                inputWidth="220px"
                value={searchWord}
              />
              <DropdownButton
                component={<FlyoutMenu>
                  <MenuItem label="Alphabetically" onClick={() => setSortArg("alphAll")}/>
                  <MenuItem label="Alphabetically After Category" onClick={() => setSortArg("alphCat")}  />
                  <MenuItem label="Alphabetically After Commodity" onClick={() => setSortArg("alphCom")} />
                  <MenuItem label="Stock Balance" onClick={() => setSortArg("stock")} />
                  <MenuItem label="Clear Sorting Choice" onClick={() => setSortArg("clear")} />
                </FlyoutMenu>}
                name="buttonName"
                value="buttonValue"
              >
                Sort
              </DropdownButton>

            </ButtonStrip>
          <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Category</TableCellHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Stock balance</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {sortedCategories.map(category => (
                        <React.Fragment key={category}>
                            <TableRow>
                                <TableCell className="category" colSpan={3}>{category}</TableCell>
                            </TableRow>
                            {groupedData[category].map(row => (
                                <TableRow key={row.id}
                                          onClick={() => handleTableRowClick(row)}
                                >
                                    <TableCell></TableCell>
                                  <TableCell onClick={() => setSelectedCommodity(row)}>
                                    {row.displayName}
                                  </TableCell>                                    <TableCell>{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
          </Table>
            {showSlideLeftPage && selectedCommodity && (
              <div style={{ marginLeft: '10px', width: 50, position: 'relative' }}>
                <Table style={{ width: '100%' }}>
                  <TableHead>
                    <TableRowHead>
                      <TableCellHead>Selected Commodity</TableCellHead>
                    </TableRowHead>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>{selectedCommodity.displayName}</TableCell>
                      <TableCell>{selectedCommodity.value}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        );
    }

