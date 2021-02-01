import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { Center } from "../components/Center";

const Stack = createStackNavigator();

const AnimeDetails = ({ navigation }) => {
  console.log("hello from anime details")
  return(
      <Center>
          <Text style={{color:"red"}}>
              Hello from AnimeDetails XD
          </Text>
      </Center>
  )
}

export const AnimeStack = ({}) => {
  return (
    <Stack.Navigator initialRouteName="AnimeDetails">
      <Stack.Screen
        name="AnimeDetails"
        component={AnimeDetails}
      />
    </Stack.Navigator>
  );
};
