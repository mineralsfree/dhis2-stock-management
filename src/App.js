import React from "react";
import classes from "./App.module.css";
import {useState} from "react";

import {Commodity} from "./Commodity";
import {Balance} from "./Balance";
// import {Insert} from "./Insert";
// import {Datasets} from "./Datasets";

import {Navigation} from "./Navigation";
import {useDataQuery} from "@dhis2/app-runtime";

const query = {
    mikita: {
        resource: 'me',
        params: {
            fields: [
                'id',
                'name',
                'organisationUnits'
            ],
        },
    },
    dataSets: {
        resource: 'dataSets/ULowA8V3ucd',
        params: {
            fields: ['dataSetElements[dataElement[id, displayName, categoryCombo[name,id,categoryOptionCombos[name,id]]]']
        }
    },
    organisation: {
     resource: 'organisationUnits/ImspTQPwCqd',
        params: {
         fields: [
             'dataSets[id, name, displayName]',
             'users[id, name, displayName]',
             '*'
         ]
        }
    }
}
const dataSetsQuery = {
    dataSets: {
        resource: 'dataSets'
    }
}

function MyApp() {
    const [activePage, setActivePage] = useState("Balance");
    const me = useDataQuery(query);
    const dataSets = useDataQuery(dataSetsQuery)
    if (me.data) {
        // console.log(me.data);
    }
    if (dataSets.data) {
        // console.log(dataSets.data);
    }

    function activePageHandler(page) {
        setActivePage(page);
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
                {activePage === "Balance" && <Balance/>}
                {/*    {activePage === "Insert" && <Insert/>}*/}
                {activePage === "Commodity" && <Commodity/>}
            </div>
        </div>
    );
}

export default MyApp;
