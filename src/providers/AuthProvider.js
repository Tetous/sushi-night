import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { Client } from "anilist-wrapper";
import { Platform } from "react-native";
import {
  openAuthSessionAsync,
  maybeCompleteAuthSession,
} from "expo-web-browser";

import { makeUrl } from "expo-linking";

maybeCompleteAuthSession();

export const AuthContext = createContext();

//4612 is for web, 4625 is for mobile.
const clients = [4612, 4625];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [authURL, setAuthURL] = useState(
    "https://anilist.co/login?apiVersion=v2&client_id=????&response_type=token"
  );

  useEffect(() => {
    setAuthURL(
      Platform.OS === "web"
        ? `${authURL.replace("????", clients[0])}`
        : `${authURL.replace("????", clients[1])}`
    );
    AsyncStorage.getItem("accessToken").then((u) => {
      if (u) {
        //if token is invalid Client constructor throws an error.
        try {
          setClient(new Client(JSON.parse(u)));
          setUser(JSON.parse(u));
        } catch (err) {
          AsyncStorage.removeItem("accessToken");
          setUser(null);
          console.log("u dumb bitch");
        }
      }
    });
  }, []);

  const saveToken = (token) => {
    console.log("got the token: " + token);
    setUser(token);
    AsyncStorage.setItem("accessToken", JSON.stringify(token));
    setClient(new Client(token));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        client,
        authURL,
        login: async () => {
          try {
            let result = await openAuthSessionAsync(authURL,makeUrl());
            if (result.url) {
              const { url } = result;
              let token = url.split("#access_token=").pop().split("&")[0];
              console.log(token)
              saveToken(token);
            }else{
              console.log(result.type)
            }
          } catch (error) {
            console.log("error opening browser: " + error);
          }
        },
        logout: () => {
          setUser(null);
          setClient(null);
          console.log("logging out");
          AsyncStorage.removeItem("accessToken");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
