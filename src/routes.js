import React,{ useContext } from "react"
import { AuthContext } from "./providers/AuthProvider"
import { NavigationContainer, DarkTheme } from "@react-navigation/native"
import { RootNav } from "./AppTabs";
import { AuthStack } from "./stacks/Auth";


export const Routes = () =>{
    const {client} = useContext(AuthContext);

    return (
        <NavigationContainer theme={DarkTheme}>
            {client ? <RootNav/> : <AuthStack />}
        </NavigationContainer>
    );
}