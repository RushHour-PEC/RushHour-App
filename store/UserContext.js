import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);

  
  const updateUser = (newUserData) => {
    console.log("updated");
    setUserData(newUserData);
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};