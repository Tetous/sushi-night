import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Feather, EvilIcons } from "@expo/vector-icons";
import { HomeStack } from "./stacks/Home";
import { SearchStack } from "./stacks/Search";
import { SettingsStack } from "./stacks/Settings";
import { Text, View } from "react-native";

const Tabs = createBottomTabNavigator();

export const AppTabs = ({}) => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <AntDesign name={"home"} size={size} color={color} />;
          } else if (route.name === "Search") {
            return <EvilIcons name={"search"} size={32} color={color} />;
          } 
          else if (route.name === "Settings") {
            return <Feather name={"settings"} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        adaptive:false,
        style:{height:52},
        labelStyle:{marginBottom:4}
      }}
    >
      <Tabs.Screen name="Home" component={HomeStack} />
      <Tabs.Screen name="Search" component={SearchStack} />
      <Tabs.Screen name="Settings" component={SettingsStack} />
    </Tabs.Navigator>
  );
};
