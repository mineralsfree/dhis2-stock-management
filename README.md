# DHIS2 Stock Management Application for Whotopia Health Clinics

## Project Description

> Develop a user-friendly DHIS2 application for Whotopia health clinics to track commodity transactions, integrate with the DHIS2 API for real-time updates, and automatically manage stock data, enhancing efficiency and accuracy in logistics planning.

### Background

Insufficient health services in Whotopia have left a significant portion of the population vulnerable, with almost half of all health facilities facing shortages of essential drugs. Discrepancies in drug distribution have resulted in critical stock-outs in some facilities, while others face overstocking and wastage. This situation hampers the government's efforts to minimize morbidity and mortality from curable diseases such as malaria and tuberculosis.

### Current System:

Whotopia has implemented DHIS2 to support logistics management. Monthly, each clinic's pharmacy department submits data on commodity consumption, end-balance, and estimates for the next period. These reports guide regional warehouses in determining the quantity of medicines and commodities to ship to clinics in the following month.

### Project Objective:

The Ministry of Health recognizes the increasing access to desktop computers or tablets in clinics and desires a DHIS2 application for stock management. The goal is to have a user-friendly application where personnel can register each transaction when a certain amount of a commodity is collected. This application should leverage the DHIS2 API to store transaction data, update the number of commodities left, and automatically reflect changes in the "Consumption" and "End balance" fields in the existing data set.

### Application Functionalities and How To Use

The application consist of three main pages:

**1. Stock Balance:**

- **Description:** The initial landing page upon entering the application.
- **Features:**

  - Displays a table showing all commodities and their respective stock balances.
  - Implemented search functionality for finding specific commodities.
  - Default sorting of the table is alphabetical, with the option to sort by stock balance.
  - Clicking on a commodity reveals a table on the right, displaying nearby clinics and their respective stock levels.
  - Users can request commodities by entering the desired quantity and clicking "Request Commodities."
  - A toast notification confirms the successful request.

- **How to use:**
  - Upon entering the application, view the alphabetical stock balance table.
  - Utilize the search function to find specific commodities.
  - Sort the table by clicking the sort button (note: click outside the menu to apply the sort).
  - Click on a commodity to view nearby clinics and their stock levels.
  - Request commodities by entering the desired quantity and clicking "Request Commodities."
  - Receive a confirmation toast for successful requests.

**2. Register Dispens:**

- **Description:** The second page in the navigation bar where users can register the dispensing of trade goods. The screen initially displays a form used to record the issuance of commodities.

- **Features:**
  - A form to register dispens
  - Dropdown menus for selecting "dispensed by" and "dispenser to" from a list of individuals.
    - Form to input the commodity name and quantity for dispensing.
    - Real-time display of the current stock quantity below the commodity input, with an error message for exceeding stock limits.
    - "Add commodity" button to dynamically expand the form for multiple dispensing entries.
    - Automatic pre-filling of date and time fields based on data, allowing user modification.
    - A "Commodity Dispense History" which isis dynamically updated upon clicking the "Register" button in the form, showcasing a comprehensive record of dispensed commodities, encompassing all the information entered in the form.
    - A form at the right side where a new recipient via "Add New Recipient" can be added, including name and department fields.
    - Confirmation toast notification for successful addition of a new recipient.
- **How to use:**

  1.  **Registering Commodity Dispense:**

  - Navigate to the "Register Commodity" page.
  - Choose the dispensing and receiving individuals from the dropdown menus.
  - Enter the commodity name and quantity, ensuring it does not exceed the available stock.
  - Use the "add commodity" button for multiple dispensing entries.
  - Confirm the date and time fields, and click "Register" to submit the dispensing details.
  - View the results in the "Commodity Dispense History" table.

  2.  **Adding a New Recipient:**

      - If the recipient is not in the list, click "Add New Recipient."
      - Fill in the recipient's name and department in the displayed form.
      - Click "Register" to add the new recipient, and confirm the toast notification.
      - The new recipient is now listed for future dispensing entries.

**3. Delivery:**

## Technologies Used

- HTML
- Javascript with React
- Npx
- Yarn

## Installation Instructions

##### Prerequisites:

- Node v18.17.1
- yarn 1.22.19

## How to run

1. Clone the repository

2. Open the DHIS2-portal:  
   `npx dhis-portal --target=https://data.research.dhis2.org/in5320/`

3. Run the program:
   `yarn start`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).

## First protypes

![bilde1](https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/94d7b187-2292-49d3-ac95-d93506580217)

![bilde2](https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/65d8e43d-f760-4092-9caa-e62a51c9adab)

![bilde3](https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/d817311d-3eee-4762-88ff-44e205122752)

This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).
