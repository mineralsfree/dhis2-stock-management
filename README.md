# DHIS2 Stock Management Application for Whotopia Health Clinics



> Develop a user-friendly DHIS2 application for Whotopia health clinics to track commodity transactions, integrate with the DHIS2 API for real-time updates, and automatically manage stock data, enhancing efficiency and accuracy in logistics planning.
## Project Description

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

**3. Register Delivery:**
- **Description:** The Delivery page enables flexible registration of bulk or individual deliveries, featuring a default bulk form switchable via the top menu. Users can specify recipients, enter quantities, set delivery times, and view detailed history.

- **Features:**
  - Users have the flexibility to register deliveries either in bulk or individually, using the page's dedicated form.
  - The default view is the bulk registration form, which can be changed by selecting the option in the top menu.
  - Clicking "Register Arrival" adds the delivery details to the "Delivery Arrival History" table.
  - Users can view detailed information in the "Delivery Arrival History" table by clicking on the "View Details" button.
  - Users can set the time of delivery, ensuring accurate tracking of arrival details.
  - A toast message will appear at the top of the screen upon clicking "Register" to confirm the successful registration of the delivery.



- **How to Use:**
  - Register arrival:
      1. Choose between bulk registration or individual registration.
      2. Specify the recipient receiving the commodities by filling out the "Stored by" field in the form.
      3. For each commodity, input the quantity in the designated field.
      4. Optionally, set the time of delivery using the provided time field (auto-filled by default).
      5. Click "Register Arrival," and the delivery will be recorded in the "Delivery Arrival History" table below, and a toastmessage at the top of the screen.

  - Check earlier deliverys and View Details:
      1. Locate the desired delivery in the "Delivery Arrival History" table.
      2. Click on "View Details" to access comprehensive information about the selected delivery.


## Screenshots of the Appllication

### 1. Stock Balance
<img width="1422" alt="Skjermbilde 2023-11-17 kl  21 26 33" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/bac4bd8d-a5a6-4ea7-92a3-445933f2e0e5">

<img width="1431" alt="Skjermbilde 2023-11-17 kl  21 26 48" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/5bf3ea0b-fe4b-41be-ad59-ad5079c0b8e8">


### 2. Dispens Commodity
<img width="1432" alt="Skjermbilde 2023-11-17 kl  21 27 43" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/ad705e0f-6de6-471d-b5fd-15a11d435170">

<img width="1426" alt="Skjermbilde 2023-11-17 kl  21 27 59" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/f0c5071e-e60e-4e24-8ee1-9e25aa6b829e">


### 3. Register Delivery
<img width="1427" alt="Skjermbilde 2023-11-17 kl  21 28 32" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/42a59a38-6155-44ce-9397-6103fc047346">


<img width="1440" alt="Skjermbilde 2023-11-17 kl  21 28 44" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/afd9ae6c-9d67-42ad-a6f6-38b1e643e434">


<img width="1429" alt="Skjermbilde 2023-11-17 kl  21 29 00" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/cfeef7be-4f74-433e-9986-e4893aaf4fec">

<img width="1427" alt="Skjermbilde 2023-11-17 kl  21 29 23" src="https://github.com/mineralsfree/dhis2-stock-management/assets/69040348/9668f683-3abf-40b4-b74e-d1f67a7b2e2c">





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
