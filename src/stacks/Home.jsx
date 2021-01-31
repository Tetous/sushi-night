import React, { useContext, FC, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Center } from "../components/Center";
import { Text, TouchableOpacity, FlatList, Button } from "react-native";
import { MediaListStatus } from "anilist-wrapper";
import { AuthContext } from "../providers/AuthProvider";
import { ActivityIndicator } from "react-native-paper";
import { EntryAnimePoster } from "../components/AnimePoster";

const Stack = createStackNavigator();

const Feed = ({ navigation }) => {
  const { client, user } = useContext(AuthContext);

  var fetching = true;
  var error = null;

  var filter = MediaListStatus.Current;
  var filteredList = [];

  useEffect(() => {
    const fetchAnimeList = async () => {
      client
        .fetchUserAnimeList()
        .then((collection) => {
          fetching = false;
          if (collection.lists.length) {
            collection.lists.map((l) => {
              if (l.status === filter) filteredList = l.entries;
            });
          }
        })
        .catch((err) => (error = err));
    };
    fetchAnimeList();
    console.log("user is: " + user);
  }, []);

  if (error)
    return (
      <Center>
        <Text>{JSON.stringify(error)}</Text>
      </Center>
    );
  else if (fetching)
    return (
      <Center>
        <ActivityIndicator size="large" />
      </Center>
    );
  else if (!client.animeLists.lists.length) {
    return (
      <Center>
        <Text>
          Looks like you haven't filled in any entries in AniList, move to the
          search tab and start wacthing!
        </Text>
      </Center>
    );
  } else
    return (
      <Center>
        <FlatList
          style={{ width: "100%" }}
          renderItem={({ item }) => {
            return (
              <EntryAnimePoster
                Entry={{ anime: item }}
                onPress={() => {
                  navigation.navigate("EntryAnimeDetailsParamList", {
                    AnimeDetails: {
                      anime: item,
                    },
                  });
                }}
              />
            );
          }}
          //                            id of the entry.
          keyExtractor={(anime, _) => anime.id.toString()}
          data={filteredList}
        />
      </Center>
    );
};

export const HomeStack = ({}) => {
  const { logout } = useContext(AuthContext);
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  logout();
                }}
              >
                <Text>Log out</Text>
              </TouchableOpacity>
            );
          },
        }}
        component={Feed}
      />
    </Stack.Navigator>
  );
};
