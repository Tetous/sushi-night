import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Center } from "../components/Center";
import { FlatList, TouchableOpacity} from "react-native";
import { MediaListStatus } from "anilist-wrapper";
import { AuthContext } from "../providers/AuthProvider";
import { EntryAnimePoster } from "../components/AnimePoster";
import { Text, ActivityIndicator, RadioButton } from "react-native-paper";

const Stack = createStackNavigator();

const Feed = ({ navigation }) => {
  const { client, user } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  var fetching = true;
  var error = null;

  var lists = [];
  var [animeWatching, animeCompleted, animeDropped, animePaused] = lists;
  var filteredList = null;

  const handlePress = () => {
    setExpanded(!expanded); 
  };

  useEffect(() => {
    const fetchAnimeList = async () => {
      client
        .fetchUserAnimeList()
        .then((collection) => {
          if (collection.lists.length) {
            collection.lists.map((l) => {
              if (l.status === MediaListStatus.Current) {
                animeWatching = l;
              } else if (l.status === MediaListStatus.Completed) {
                animeCompleted = l;
              } else if (l.status === MediaListStatus.Dropped) {
                animeDropped = l;
              } else if (l.status === MediaListStatus.Paused) {
                animePaused = l;
              }
            });
          }
          fetching = false;
          console.log("user is: " + user);
        })
        .catch((err) => (error = err));
    };
    fetchAnimeList();
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
          search tab and start watching!
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
                  navigation.navigate("EntryAnimeDetails", {
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
