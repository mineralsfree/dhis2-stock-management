import React from "react";
import {useDataQuery} from '@dhis2/app-runtime'
import {CircularLoader} from "@dhis2/ui";
import "./styles.css"; 
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    InputField,
    Button
} from '@dhis2/ui'

const dataQuery = {
    dataSets: {
        resource: 'dataSets/aLpVgfXiz0f',
        params: {
            fields: [
                'name',
                'id',
                '*',
                'dataSetElements[dataElement[id, displayName]',
                // 'dataSetElements[dataElement[*]'
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
                // 'dataSetElements[dataElement[id, displayName]',
                'dataSetElements[dataElement[name,displayName, id,dataElementGroups[name], categoryCombo[name,id,categoryOptionCombos[name,id, *]]]'
            ],
        },
    },
    dataValueSets: {
        resource: 'dataValueSets',
        params: {
            orgUnit: 'KiheEgvUZ0i',
            dataSet: 'aLpVgfXiz0f',
            period: '2020',
        },
    },
    commoditiesValue: {
        resource: 'dataValueSets',
        params: {
            dataSet: 'ULowA8V3ucd',
            period: '202310',
            orgUnit: "ZpE2POxvl9P"
        }
    }
}

const mergeData = (data)=> {
    return data.commoditiesSet.dataSetElements.map(d => {
        let matchedValue = data.commoditiesValue.dataValues.find(dataValues => {
            if (dataValues.dataElement === d.dataElement.id) {
                return true
            }
        })
        return {
            displayName: d.dataElement.name.replace(/Commodities( - )?/, ''),
            id: d.dataElement.id,
            value: matchedValue.value,
            // get longer group (category) and remove "Comodity" prefix
            category: d.dataElement.dataElementGroups.sort((a,b)=>b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '')
        }
    })
}

export function Commodity() {
    const {loading, error, data} = useDataQuery(dataQuery)
    const handleInputChange = (event) => {
        console.log(event.target.value);
    };


    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large/>
    }

    if (data) {
        // Sort by category
        let mergedData = mergeData(data).sort((a,b)=> (a.category >  b.category) ? -1 :1);
        console.log(data);
        // console.log(mergedData);
        return (
            <div>
     <form className="my-form">

      <div className="form-row">
        <div>
        <span>Commodity</span>
          <DropdownButton
            component={
            <FlyoutMenu>
                <MenuItem label="Item 1" />
                <MenuItem label="Item 2" />
                <MenuItem label="Item 3" />
              </FlyoutMenu>
  }
         initialFocus
            label="Amount"
            name="amount"
            value="buttonValue1"
            className="dropdown"
            >Label me 
            </DropdownButton>
        </div>
        <div>
        <span>Amount</span>
        <DropdownButton
            component={
            <FlyoutMenu>
                <MenuItem label="Item 1" />
                <MenuItem label="Item 2" />
                <MenuItem label="Item 3" />
              </FlyoutMenu>
  }
         initialFocus
            label="Amount"
            name="amount"
            value="buttonValue1"
            className="dropdown"
            > Label me 
            </DropdownButton>
        </div>
      </div>
      <div className="form-row">
      <div>
        <span>Dispensed by</span>
          <DropdownButton
            component={
            <FlyoutMenu>
                <MenuItem label="Item 1" />
                <MenuItem label="Item 2" />
                <MenuItem label="Item 3" />
              </FlyoutMenu>
  }
         initialFocus
            label="Amount"
            name="amount"
            value="buttonValue1"
            className="dropdown"
            >Label me 
            </DropdownButton>
        
        </div>
        <div>
        <span>Dispensed to</span>

        <DropdownButton
            component={
            <FlyoutMenu>
                <MenuItem label="Item 1" />
                <MenuItem label="Item 2" />
                <MenuItem label="Item 3" />
              </FlyoutMenu>
  }
         initialFocus
            label="Amount"
            name="amount"
            value="buttonValue1"
            className="dropdown"
            >Label me 
            </DropdownButton>
        </div>
      </div>
      <div className="form-row">
      <div>
        <span>Data</span>
          <DropdownButton
            component={
            <FlyoutMenu>
                <MenuItem label="Item 1" />
                <MenuItem label="Item 2" />
                <MenuItem label="Item 3" />
              </FlyoutMenu>
  }
         initialFocus
            label="Amount"
            name="amount"
            value="buttonValue1"
            className="dropdown"
            >Label me 
            </DropdownButton>
        
        </div>
        <div>
        <span>Time</span>

        <DropdownButton
            component={
            <FlyoutMenu>
                <MenuItem label="Item 1" />
                <MenuItem label="Item 2" />
                <MenuItem label="Item 3" />
              </FlyoutMenu>
  }
         initialFocus
            label="Amount"
            name="amount"
            value="buttonValue1"
            className="dropdown"
            >Label me 
            </DropdownButton>
        </div>
      </div>

      <div className="form-button">
       
        <Button
        
          name="Basic button"
          onClick={handleInputChange}
          value="default"
        >
          Save
        </Button>
      </div>
    </form>

                
                <h2>Table of Commodity dispesing registy</h2>
            <Table>
                
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Time</TableCellHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Amount</TableCellHead>
                        <TableCellHead>Dispensed by</TableCellHead>
                        <TableCellHead>Dispensed to</TableCellHead>
                        <TableCellHead>Data</TableCellHead>

                        {/*<TableCellHead>ID</TableCellHead>*/}
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {mergedData.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell>{row.displayName}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                {/*<TableCell>{row.id}</TableCell>*/}
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{row.category}</TableCell>    
                                <TableCell>{row.category}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table></div>)
    }
    return <h1>Commodity</h1>;
}
