import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Feather, EvilIcons } from "@expo/vector-icons";
import { HomeStack } from "./stacks/Home";
import { SearchStack } from "./stacks/Search";
import { SettingsStack } from "./stacks/Settings";
import { AnimeStack } from "./stacks/Anime";
import { createStackNavigator } from "@react-navigation/stack";

const Root = createStackNavigator();
const Tabs = createBottomTabNavigator();

export const RootNav = ({}) => {
  return (
    <Root.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Root.Screen
        name="Tabs"
        component={AppTabs}
      />
      <Root.Screen
        name="Anime"
        component={AnimeStack}
        screenOptions={{ headerShown: false }}
      />
    </Root.Navigator>
  );
};

export const AppTabs = ({}) => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <AntDesign name={"home"} size={size} color={color} />;
          } else if (route.name === "Search") {
            return <EvilIcons name={"search"} size={32} color={color} />;
          } else if (route.name === "Settings") {
            return <Feather name={"settings"} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        adaptive: false,
        style: { height: 52 },
        labelStyle: { marginBottom: 4 },
        keyboardHidesTabBar: true,
      }}
    >
      <Tabs.Screen name="Search" component={SearchStack} />
      <Tabs.Screen name="Home" component={HomeStack} />
      <Tabs.Screen name="Settings" component={SettingsStack} />
    </Tabs.Navigator>
  );
};
