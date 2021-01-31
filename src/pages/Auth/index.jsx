import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Avatar, Button, IconButton } from "react-native-paper";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { maybeCompleteAuthSession, openBrowserAsync } from "expo-web-browser";

const Login = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          paddingBottom: 60,
          marginTop: 50,
          marginLeft: 60,
        }}
      >
        <Avatar.Image source={require("../../static/logo.png")} size={400} />
        <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              openBrowserAsync("https://github.com/system32uwu");
            }}
          >
            <Avatar.Image
              source={{
                uri:
                  "https://avatars.githubusercontent.com/u/29718978?s=460&u=3fd4f3b9037124ffd108bf32725d877ba7e9f07c&v=4",
              }}
              style={{ alignSelf: "flex-end" }}
            />
            <AntDesign
              name="github"
              color="white"
              size={16}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                marginTop: 45,
                backgroundColor: "black",
              }}
            />
            <Text
              style={{ position: "absolute", marginLeft: 67, marginTop: 45 }}
            >
              system32uwu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ fontSize: 24 }}>
        Welcome to Sushi Night, watch anime and keep your list synced as you do.
      </Text>
      <Button
        mode="outlined"
        style={{ alignSelf: "center", marginTop: 20 }}
        onPress={() => console.log("xd")}
      >
        <Text style={{ alignSelf: "center", marginTop: 4 }}>
          Log In with AniList
        </Text>
        <Avatar.Icon
          size={20}
          icon="arrow-right"
          style={{ alignSelf: "center", marginLeft: 6 }}
        />
      </Button>
      <View
        style={{
          flexDirection: "row",
          marginTop: 40,
          justifyContent: "space-between",
          alignSelf:"center"
        }}
      >
        <TouchableOpacity>
          <FontAwesome5
            name="telegram"
            color="aqua"
            size={30}
            style={{ width: 50, height: 35 }}
            onPress={() => openBrowserAsync("https://t.me/sushinight")}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5
            name="patreon"
            color="coral"
            size={30}
            style={{ width: 50, height: 35 }}
            onPress={() => openBrowserAsync("https://patreon.com")}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign
            name="github"
            color="white"
            size={30}
            style={{ width: 50, height: 35 }}
            onPress={() => openBrowserAsync("https://github.com/system32uwu/sushi-night")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
});

export default Login;
