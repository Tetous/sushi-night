import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{ createContext, useEffect, useState } from "react";
import { Client } from "anilist-wrapper";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() =>{
    AsyncStorage.getItem("user").then(u => {
      if (u){
        setUser(JSON.parse(u));
        setClient(new Client(u));
      }
    })
  },[])
  return (
    <AuthContext.Provider
      value={{
        user,
        client,
        login: (accessToken) => {
          setUser(accessToken);
          AsyncStorage.setItem("accessToken", JSON.stringify(accessToken));
          setClient(new Client(accessToken));
        },
        logout: () => {
          setUser(null);
          AsyncStorage.removeItem("user");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
