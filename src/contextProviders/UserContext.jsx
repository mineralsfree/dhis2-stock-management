import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    // Fetch your data here and set it in the state
    async function fetchData() {
      try {
        const response = await fetch('your-api-endpoint');
        const data = await response.json();
        setFetchedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ fetchedData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };