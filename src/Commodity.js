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
      orgUnit: "KiheEgvUZ0i",
      dataSet: "aLpVgfXiz0f",
      period: "2020",
    },
  },
  commoditiesValue: {
    resource: "dataValueSets",
    params: {
      dataSet: "ULowA8V3ucd",
      period: "202310",
      orgUnit: "ZpE2POxvl9P",
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
    orgUnit: "KiheEgvUZ0i",
    dataValues: dataValues.map((dataValue) => ({
      dataElement: dataValue.dataElement,
      categoryOptionCombo: "J2Qf1jtZuj8", // consumption
      value: dataValue.value,
      storedBy: ({ storedBy }) => storedBy,
    })),
  }),
};

export function Commodity() {
  const [mutate, { loading, error }] = useDataMutation(dataMutationQuery);

  const handleSubmit = (values, ids) => {
    console.log("Submitted2");
    console.log(values, ids);

    const dateDispensed = values["dateDispensed"];
    const dataValues = ids.map((id) => ({
      dataElement: values[`commodity_${id}`],
      value: values[`amount_${id}`],
    }));
    const storedBy = values["dispensedBy"];
    const orgUnit = values["dispensedTo"];

    console.log(dataValues);

    mutate({
      completeDate: dateDispensed,
      dataValues: dataValues,
      storedBy: "SOMETHINGWORKS",
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
  const { loading, error, data } = useDataQuery(dataQuery);
  //   const { loading2, error2, commodities2, refetch2 } = useCommodities();
  const handleInputChange = (event) => {
    console.log(event.target.value);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (!data) {
    return null;
  }

  // Sort by category
  let mergedData = mergeData(data).sort((a, b) =>
    a.category > b.category ? -1 : 1
  );
  // console.log(data);
  // console.log(mergedData);

  return (
    <>
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
          {mergedData.map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.displayName}</TableCell>
                <TableCell>{row.value}</TableCell>
                {/*<TableCell>{row.id}</TableCell>*/}
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.category}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
