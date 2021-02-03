import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Center } from "../components/Center";
import { FlatList, TouchableOpacity, View } from "react-native";
import { MediaListStatus } from "anilist-wrapper";
import { AuthContext } from "../providers/AuthProvider";
import { EntryAnimePoster } from "../components/AnimePoster";
import { Text, ActivityIndicator, Avatar, Divider } from "react-native-paper";
import { AnimeStack } from "./Anime";
import DropDownPicker from "react-native-dropdown-picker";

const Stack = createStackNavigator();

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
        navigation.navigate(
          "Anime"
        );
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
      <View style={{ flex: 1 }}>
        <DropDownPicker
          items={[
            { label: "Currently watching", value: MediaListStatus.Current },
            { label: "Completed", value: MediaListStatus.Completed },
            { label: "Paused", value: MediaListStatus.Paused },
            { label: "Planning to watch", value: MediaListStatus.Planning },
            { label: "Dropped", value: MediaListStatus.Dropped },
          ]}
          defaultValue={MediaListStatus.Current}
          containerStyle={{ height: 40 }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa" }}
          onChangeItem={(item) => setFilter(item.value)}
        />
        <Divider />
        {filteredList ? (
          <FlatList
            style={{ width: "100%", flex: 1 }}
            renderItem={renderItem}
            //                            id of the entry.
            keyExtractor={(item) => item.id.toString()}
            extraData={filter}
            data={filteredList.entries}
            numColumns={3}
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
                  size={60}
                  source={{ uri: client.userData.avatar.large }}
                />
                <Text style={{ marginTop: 35, marginLeft: 10, color: "black" }}>
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
                <Text style={{ color: "red", marginRight: 12 }}>Log out</Text>
              </TouchableOpacity>
            );
          },
        }}
        component={Feed}
      />
    </Stack.Navigator>
  );
};
