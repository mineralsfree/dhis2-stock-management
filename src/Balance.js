
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
    const { loading, error, data } = useDataQuery(dataQuery);

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }

    if (data) {
        const groupedData = data.commoditiesSet.dataSetElements.reduce((acc, d) => {
            const displayName = d.dataElement.name.replace(/Commodities( - )?/, '');
            const matchedValue = data.commoditiesValue.dataValues.find(dataValues => dataValues.dataElement === d.dataElement.id);
            const category = d.dataElement.dataElementGroups.sort((a, b) => b.name.length - a.name.length)[0].name.replace(/Commodities( - )?/, '');

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push({ displayName, value: matchedValue.value, id: d.dataElement.id });

            return acc;
        }, {});

        return (
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Category</TableCellHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Stock balance</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {Object.keys(groupedData).map(category => (
                        <React.Fragment key={category}>
                            <TableRow>
                                <TableCell className="category" colSpan={3}>{category}</TableCell>
                            </TableRow>
                            {groupedData[category].map(row => (
                                <TableRow key={row.id}>
                                    <TableCell></TableCell>
                                    <TableCell>{row.displayName}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return <h1>Browse</h1>;
}
