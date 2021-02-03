import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";


const Stack = createStackNavigator();

const Main = ({ navigation }) => {
  return(
      <View>
          <Text>
              Hello from Search
          </Text>
      </View>
  )
}

export const SearchStack = ({}) => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={Main}
      />
    </Stack.Navigator>
  );
};
