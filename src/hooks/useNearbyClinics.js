import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { END_BALANCE_ID, getNearbyClinics, ORG_UNIT } from "../consts";

const dataQuery = {
  commoditiesSet: {
    resource: "dataSets/ULowA8V3ucd",
    params: {
      fields: [
        "name",
        "id",
        "dataSetElements[dataElement[name,displayName, id,dataElementGroups[name], categoryCombo[name,id,categoryOptionCombos[name,id, *]]]",
      ],
    },
  },
  commoditiesValue: {
    resource: "dataValueSets",
    params: {
      dataSet: "ULowA8V3ucd",
      period: "202310",
      orgUnit: getNearbyClinics().join(","),
    },
  },
  orgUnit: {
    resource: "organisationUnits/uKC54fzxRzO", //parent OrgUnit
    params: {
      fields: ["name,id,dataSets[name,id],children[name,id,dataSets[name,id]]"],
    },
  },
};

const mergeData = (data) => {
  const retObj = [];

  data.commoditiesSet.dataSetElements.forEach((d) => {
    const displayName = d.dataElement.displayName
      .replace(/Commodities( - )?/, "")
      .trim();
    let endBalances = data.commoditiesValue.dataValues.filter(
      (dataValues) =>
        dataValues.dataElement === d.dataElement.id &&
        dataValues.categoryOptionCombo === END_BALANCE_ID,
    );
    endBalances
      .filter((endBalance) => endBalance.orgUnit !== ORG_UNIT)
      .forEach((endBalance) => {
        const element = {
          displayName: displayName,
          id: d.dataElement.id,
          endBalance: endBalance.value,
          orgUnitName:
            data.orgUnit.children.find(
              (child) => child.id === endBalance.orgUnit,
            )?.name || endBalance.orgUnit,
          orgUnit: endBalance.orgUnit,
          inStock: endBalance, // remove
        };
        retObj.push(element);
      });
  });
  return retObj;
};

export const useNearbyClinics = () => {
  const [nearbyClinics, setNearbyClinics] = useState(null);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const {
    loading,
    error,
    data,
    refetch: internalRefetch,
  } = useDataQuery(dataQuery);
  const refetch = () => {
    setRefetchLoading(true);
    internalRefetch().then((value) => {
      setNearbyClinics(mergeData(value));
      setRefetchLoading(false);
    });
  };
  //in order to refetch to work;
  if (refetchLoading && nearbyClinics) {
    setNearbyClinics(null);
  }
  if (data && !nearbyClinics && !refetchLoading) {
    console.log("nearby", data);

    setNearbyClinics(mergeData(data));
  }
  return { loading: loading || refetchLoading, error, nearbyClinics, refetch };
};
