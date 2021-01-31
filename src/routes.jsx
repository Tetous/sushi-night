import React,{ useContext } from "react"
import { AuthContext } from "./providers/AuthProvider"
import { NavigationContainer } from "@react-navigation/native"
import { AppTabs } from "./AppTabs";
import Login from "./pages/Auth";

export const Routes = () =>{
    const {client} = useContext(AuthContext);

    return (
        <NavigationContainer>
            {client ? <AppTabs/> : <Login />}
        </NavigationContainer>
    );
}