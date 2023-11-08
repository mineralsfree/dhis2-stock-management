import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import "./styles.css";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import { useCommodities } from "./hooks/useCommodities";
import CommodityDispenseForm from "./components/CommodityDispense/CommodityDispenseForm";

const dataQuery = {
  dataSets: {
    resource: "dataSets/aLpVgfXiz0f",
    params: {
      fields: [
        "name",
        "id",
        "*",
        "dataSetElements[dataElement[id, displayName]",
        // 'dataSetElements[dataElement[*]'
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
        // 'dataSetElements[dataElement[id, displayName]',
        "dataSetElements[dataElement[name,displayName, id,dataElementGroups[name], categoryCombo[name,id,categoryOptionCombos[name,id, *]]]",
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

const dataMutationQuery = {
  dataSet: "ULowA8V3ucd",
  resource: "dataValueSets",
  type: "create",
  completeDate: ({ completeDate }) => completeDate,
  data: ({ dataValues }) => ({
    period: "202310",
    orgUnit: "ImspTQPwCqd",
    dataValues: dataValues.map((dataValue) => ({
      dataElement: dataValue.dataElement,
      categoryOptionCombo: "J2Qf1jtZuj8", // consumption
      value: dataValue.value,
      storedBy: "johnabel", // can be ignored?
      comment: "test2",
    })),
  }),
};

export function Commodity() {
  const [mutate, { loading, error }] = useDataMutation(dataMutationQuery);

  const handleSubmit = (formInput) => {
    console.log("Submitted2");
    const storedBy = formInput.dispensedBy;
    const orgUnit = formInput.dispensedTo;

    mutate({
      completeDate: formInput.dateDispensed,
      dataValues: formInput.dataValues,
      //   storedBy: "SOMETHINGWORKS",
    })
      .then((res) => {
        console.log(res);
        alert("Data successfully submitted. TODO: Empty form.");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <CommodityDispenseForm handleRegister={handleSubmit} />
      <CommodityTable />
    </div>
  );
}

function CommodityTable() {
  //   const { loading, error, data } = useDataQuery(dataQuery);
  const { loading, error, commodities, refetch } = useCommodities();
  const handleInputChange = (event) => {
    console.log(event.target.value);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (!commodities) {
    return null;
  }

  const tabledata = [];
  Object.values(commodities).forEach((category) => {
    category.forEach((commodity) => {
      tabledata.push({
        label: commodity.displayName,
        value: commodity.id,
        inStock: commodity.inStock,
        consumption: commodity.consumption,
        endBalance: commodity.endBalance,
        category: commodity.category,
      });
    });
  });

  return (
    <>
      <h2>Table of Registered Commodities</h2>
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Commodity</TableCellHead>
            <TableCellHead>End balance</TableCellHead>
            <TableCellHead>Consumption</TableCellHead>
            <TableCellHead>Current stock</TableCellHead>
            <TableCellHead>Category</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {tabledata.map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.endBalance}</TableCell>
                <TableCell>{row.consumption}</TableCell>
                <TableCell>{row.inStock}</TableCell>
                <TableCell>{row.category}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
