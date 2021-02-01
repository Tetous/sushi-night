import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { Client } from "anilist-wrapper";
import { Platform } from "react-native";
import { maybeCompleteAuthSession, openAuthSessionAsync } from "expo-web-browser";

export const AuthContext = createContext();
maybeCompleteAuthSession();

//4612 is for web, 4625 is for mobile.
const clients = [4612, 4625];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const baseAuthURL = [
    "https://anilist.co/login?apiVersion=v2&client_id=",
    "&response_type=token",
  ];
  const [authURL, setAuthURL] = useState("");

  useEffect(() => {
    setAuthURL(
      Platform.OS === "web"
        ? `${baseAuthURL[0]}${clients[0]}${baseAuthURL[1]}`
        : `${baseAuthURL[0]}${clients[1]}${baseAuthURL[1]}`
    );
    AsyncStorage.getItem("accessToken").then((u) => {
      if (u) {
        setUser(JSON.parse(u));
        setClient(new Client(JSON.parse(u)));
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        client,
        authURL,
        login: async () => {
          try {
            let result = await openAuthSessionAsync(authURL);
            if (result) {
              const { url } = result;
              let token = url.split("#access_token=").pop().split("&")[0];
              setUser(token);
              AsyncStorage.setItem("accessToken", JSON.stringify(token));
              setClient(new Client(token));
            }
          } catch (error) {
            console.log("err webbrowser" + error);
          }
        },
        logout: () => {
          setUser(null);
          setClient(null);
          console.log("logging out");
          AsyncStorage.removeItem("user");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
