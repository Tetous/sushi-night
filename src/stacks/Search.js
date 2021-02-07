import React, { useState, useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View, FlatList, Platform } from "react-native";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { AuthContext } from "../providers/AuthProvider";
import { Center } from "../components/Center";
import { SearchAnimePoster } from "../components/AnimePoster";

const Stack = createStackNavigator();
const numColumns = Platform.OS === "web" ? 6 : 3;

const Main = ({ navigation }) => {
  const { client } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetching, setFetching] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const search = async () => {
    if (searchQuery.length > 3) {
      setFetching(true);
      console.log(searchQuery);
      await client
        .searchAnime(searchQuery, {page,perPage:25})
        .then((data) => {
          setResults(data);
          console.log(JSON.stringify(data));
        })
        .catch((err) => console.log(err));
      setFetching(false);
    }
  };

  const renderItem = ({ item }) => (
    <SearchAnimePoster
      anime={item}
      onPress={() => {
        //pass an extra param like needsUserFetchingData: true.
        navigation.navigate("Anime", {
          screen: "AnimeDetails",
          params: {
            anime: item,
          },
        });
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Searchbar
          placeholder="search for an anime"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          onSubmitEditing={() => search()}
          onIconPress={() => search()}
        />
      </View>
      <View style={{ flex: 1 }}>
        {fetching ? (
          <Center>
            <ActivityIndicator size="large" color="#00adb5" />
          </Center>
        ) : results.length ? (
          <FlatList
            style={{ width: "100%", flex: 1 }}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            data={results}
            numColumns={numColumns}
            disableVirtualization={true}
          />
        ) : null}
      </View>
    </View>
  );
};

export const SearchStack = ({}) => {
  return (
    <Stack.Navigator initialRouteName="Main" headerMode="none">
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );
};
