import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Center } from "../components/Center";
import { FlatList, Platform, TouchableOpacity, View } from "react-native";
import { MediaListStatus } from "anilist-wrapper";
import { AuthContext } from "../providers/AuthProvider";
import { EntryAnimePoster } from "../components/AnimePoster";
import { Text, ActivityIndicator, Avatar, Divider } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

const Stack = createStackNavigator();
const numColumns = Platform.OS === "web" ? 6 : 3;

const Feed = ({ navigation }) => {
  const { client } = useContext(AuthContext);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (client) {
      (async () => {
        client
          .fetchUserAnimeList()
          .then((collection) => {
            collection.lists.map((l) => {
              if (l.status === MediaListStatus.Current) {
                setFilteredList(filter);
              }
            });
            setFilter(MediaListStatus.Current);
            setFetching(false);
          })
          .catch((err) => {
            setError(err);
            console.log("error is: " + JSON.stringify(err));
          });
      })();
    }
  }, [client]);

  useEffect(() => {
    if (client.animeLists) {
      var found = true;
      client.animeLists.lists.filter((l) => {
        if (l.status === filter) {
          setFilteredList(l);
          found = true;
        }
        if (!found) setFilteredList(null);
      });
    }
  }, [filter]);

  const renderItem = ({ item }) => (
    <EntryAnimePoster
      entry={item}
      onPress={() => {
        //pass the item + the status in the list.
        navigation.navigate("Anime", {
          screen: "AnimeDetails",
          params: {
            anime: item,
          },
        });
      }}
    />
  );

  if (error)
    return (
      <Center>
        <Text style={{ color: "red" }}>{JSON.stringify(error)}</Text>
      </Center>
    );
  else if (fetching)
    return (
      <Center>
        <ActivityIndicator size="large" />
      </Center>
    );
  else
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <DropDownPicker
          items={[
            { label: "Currently watching", value: MediaListStatus.Current },
            { label: "Completed", value: MediaListStatus.Completed },
            { label: "Paused", value: MediaListStatus.Paused },
            { label: "Planning to watch", value: MediaListStatus.Planning },
            { label: "Dropped", value: MediaListStatus.Dropped },
          ]}
          defaultValue={MediaListStatus.Current}
          containerStyle={{ height: 60 }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          activeLabelStyle={{color:"#eeeeee"}}
          labelStyle={{color:"#00adb5", fontSize:16}}
          dropDownStyle={{ backgroundColor: "#393e46", borderColor: "black" }}
          onChangeItem={(item) => setFilter(item.value)}
          style={{
            backgroundColor: "#222831",
            borderColor: "black",
            marginTop: 4,
            marginBottom: 4
          }}
        />
        <Divider />
        {filteredList ? (
          <FlatList
            style={{ width: "100%", flex: 1 }}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={filter}
            data={filteredList.entries}
            numColumns={numColumns}
            disableVirtualization={true}
          />
        ) : (
          //virtualization makes scrolling thorugh flicker which is horrible.
          <Text>Esa lista esta vacia</Text>
        )}
      </View>
    );
};

export const HomeStack = ({}) => {
  const { logout, client } = useContext(AuthContext);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (client) {
      (async () => {
        await client
          .fetchUser()
          .then((d) => {
            setFetching(false);
            console.log(JSON.stringify(client.userData));
          })
          .catch((err) => {
            setError(err);
          });
      })();
    } else {
      setFetching(true);
    }
  }, [client]);

  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        options={{
          title: "",
          headerLeft: () => {
            if (fetching) {
              return (
                <ActivityIndicator style={{ marginLeft: 8 }} size="large" />
              );
            } else if (error) {
              console.log(error);
              return <Text>Error consultando datos de su usuario.</Text>;
            }
            return (
              <View style={{ flexDirection: "row", marginLeft: 8 }}>
                <Avatar.Image
                  size={50}
                  style={{alignSelf:"flex-end"}}
                  source={{ uri: client.userData.avatar.large }}
                />
                <Text
                  style={{ marginTop: 35, marginLeft: 10, color: "#00adb5" }}
                >
                  {client.userData.name}
                </Text>
              </View>
            );
          },
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  logout();
                }}
              >
                <Text style={{ color: "#00adb5", marginRight: 12 }}>
                  Log out
                </Text>
              </TouchableOpacity>
            );
          },
        }}
        component={Feed}
      />
    </Stack.Navigator>
  );
};
