import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { Center } from "../components/Center";
import { Button, Chip } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import {
  formatAnimeStatus,
  formatEpisodes,
  formatListStatus,
  epsToRender,
  calcRanges,
  getIdFromGogo,
  getEpisodeLinks,
} from "../util";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const EpisodeList = ({ from, to, gogoId, anime }) => {
  const navigation = useNavigation();
  const episodesToRender = epsToRender(from, to);

  return (
    <View>
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 20,
          alignSelf: "center",
          marginBottom: 10,
        }}
      >
        Episodes:
      </Text>
      <View
        style={{
          flexWrap: "wrap",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {episodesToRender.map((ep) => {
          return (
            <View key={ep} style={{ padding: 4, alignSelf: "flex-start" }}>
              <Button
                mode="outlined"
                labelStyle={{ fontSize: 18 }}
                onPress={() => {
                  navigation.navigate("WatchEpisode", {
                    anime,
                    gogoId,
                    ep,
                  });
                }}
              >
                {ep}
              </Button>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const AnimeDetails = ({ navigation, route }) => {
  const { client } = useContext(AuthContext);
  const { anime } = route.params;
  const [details, setDetails] = useState(null);
  const [currentFrom, setCurrentFrom] = useState(0);
  const [currentTo, setCurrentTo] = useState(0);
  const [ranges, setRanges] = useState([]);
  const [gogoId, setGogoId] = useState(null);

  useEffect(() => {
    anime.media.id = anime.mediaId;
    (async () => {
      await client
        .animeDetails(anime.media)
        .then(async (detailsResponse) => {
          detailsResponse.description = detailsResponse.description
            .replace(/<br>/g, "")
            .replace(/<[^>]*>/g, "");
          setDetails(detailsResponse);

          const rs = calcRanges(detailsResponse);
          setRanges(rs);
          setCurrentFrom(rs[0].from);
          setCurrentTo(rs[0].to);

          await getIdFromGogo(detailsResponse)
            .then((id) => {
              console.log("id is: " + id);
              setGogoId(id);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  if (!details)
    return (
      <Center>
        <ActivityIndicator size="large" />
      </Center>
    );

  return (
    <ScrollView style={{ backgroundColor: "black" }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            zIndex: 4,
            width: "100%",
            position: "absolute",
          }}
          onPress={() => navigation.goBack()}
        >
          <Entypo
            name="arrow-bold-left"
            size={60}
            color="#eeeeee"
            style={{ zIndex: 2 }}
          />
          <Entypo
            name="arrow-bold-left"
            size={56}
            color="red"
            style={{ position: "absolute", zIndex: 1 }}
          />
        </TouchableOpacity>

        <View
          style={{ alignSelf: "flex-start", width: "100%", maxHeight: "50%" }}
        >
          <Image
            source={{ uri: details.bannerImage }}
            style={{
              height: 200,
              width: "100%",
              zIndex: 0,
              position: "absolute",
              alignSelf: "flex-start",
              resizeMode: Platform.OS === "web" ? "stretch" : "cover",
            }}
            resizeMode={Platform.OS === "web" ? "stretch" : "contain"}
            resizeMethod={Platform.OS === "web" ? "scale" : "resize"}
          />
          <View
            style={{
              zIndex: 1,
              alignSelf: "flex-start",
              marginLeft: 20,
              flexDirection: "row",
              marginTop: 110,
            }}
          >
            <Image
              source={{ uri: details.coverImage.extraLarge }}
              style={{
                height: 150,
                width: 100,
                alignSelf: "flex-start",
              }}
              resizeMode="contain"
            />
            <View
              style={{
                alignSelf: "flex-end",
                flexDirection: "column",
                flexShrink: 1,
                marginLeft: 5,
                marginTop: 5,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
                numberOfLines={1}
              >
                {formatListStatus(anime.status) + formatEpisodes(anime)}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#eeeeee",
                  fontWeight: "bold",
                  alignSelf: "flex-start",
                  textAlign: "left",
                }}
              >
                {details.title.userPreferred}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          padding: 8,
        }}
      >
        <View
          style={{
            width: "100%",
            alignSelf: "flex-start",
          }}
        >
          <View
            style={{
              flexWrap: "wrap",
              alignSelf: "center",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {details.genres.map((genre) => {
              return (
                <Chip
                  key={genre}
                  style={{
                    margin: 5,
                    alignSelf: "center",
                  }}
                  textStyle={{ fontSize: 16 }}
                >
                  {genre}
                </Chip>
              );
            })}
          </View>
        </View>
      </View>
      <View
        style={{
          alignContent: "flex-end",
          justifyContent: "flex-start",
          alignSelf: "center",
          width: "80%",
          padding: 4,
        }}
      >
        <Text
          style={{
            color: "#eeeeee",
            fontSize: 18,
            textAlign: "justify",
            textAlignVertical: "top",
            lineHeight: 30,
          }}
        >
          {details.description}
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          alignContent: "center",
          alignSelf: "center",
          justifyContent: "space-evenly",
          width: "80%",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#eeeeee",
            fontSize: 18,
            textAlign: "justify",
            textAlignVertical: "top",
            fontWeight: "bold",
          }}
        >
          {`Status: ${formatAnimeStatus(details.status)}`}
        </Text>
        <Text
          style={{
            color: "#eeeeee",
            fontSize: 18,
            textAlign: "justify",
            textAlignVertical: "top",
            fontWeight: "bold",
          }}
        >
          {`Average Score: ${details.averageScore}`}
        </Text>
      </View>
      <View style={{ marginTop: 5 }}>
        <View>
          {ranges.length && gogoId ? (
            <View style={{ flexDirection: "column" }}>
              <EpisodeList
                from={currentFrom}
                to={currentTo}
                gogoId={gogoId}
                anime={details}
              />
              <View
                style={{
                  flexWrap: "wrap",
                  alignSelf: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {ranges.map((range) => {
                  return (
                    <View
                      key={range.from}
                      style={{ padding: 4, alignSelf: "flex-start" }}
                    >
                      <Chip
                        selectedColor="#00adb5"
                        onPress={() => {
                          setCurrentFrom(range.from);
                          setCurrentTo(range.to);
                        }}
                        textStyle={{ fontSize: 16 }}
                      >
                        {range.from !== range.to
                          ? `${range.from} - ${range.to}`
                          : `${range.from}`}
                      </Chip>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const WatchEpisode = ({ route }) => {
  const { anime, gogoId, ep } = route.params;
  //usar el cliente para actualizar la lista
  const { client } = useContext(AuthContext);
  const [links, setLinks] = useState(null);
  const [option, setSelectedOption] = useState(null);

  useEffect(() => {
    (async () => {
      await getEpisodeLinks(gogoId, ep).then((linksResponse) => {
        setSelectedOption(linksResponse[0]);
        setLinks(linksResponse);
      });
    })();
  }, []);

  if (!links) {
    return (
      <View style={{ backgroundColor: "black", alignContent: "center" }}>
        <ActivityIndicator size="large" style={{ alignSelf: "center" }} />
      </View>
    );
  } else if (!links.length) {
    return (
      <View style={{ backgroundColor: "black", alignContent: "center" }}>
        <Text style={{ color: "white", fontSize: 30 }}>
          There are no links yet for this episode.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "black",
        alignContent: "center",
        flex: 1,
        flexDirection: "column",
      }}
    >
      {Platform.OS === "web" ? (
        <View>
          <video controls src={option.link} />
        </View>
      ) : (
        <View>
          <WebView
            allowsFullscreenVideo={true}
            originWhitelist={["*"]}
            source={{
              html: `
              <html>
                    <body>
                        <video controls src=${option.link} />
                    </body>
              </html>
              `,
            }}
          ></WebView>
        </View>
      )}
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            alignSelf: "center",
            width: "80%",
            justifyContent: "center",
          }}
        >
          {links.map((option) => {
            return (
              <Button
                key={option.link}
                mode="contained"
                onPress={() => setSelectedOption(option)}
              >
                {option.quality}
              </Button>
            );
          })}
        </View>
        <View style={{ justifyContent: "space-evenly" }}>
          <Button icon="arrow-left" mode="contained" />
          <Button icon="arrow-right" mode="contained" />
        </View>
      </View>
    </View>
  );
};

export const AnimeStack = ({}) => {
  return (
    <Stack.Navigator initialRouteName="AnimeDetails">
      <Stack.Screen
        name="AnimeDetails"
        component={AnimeDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WatchEpisode"
        component={WatchEpisode}
        // options={({ route }) => ({
        //   headerLeft:
        //     route.params.anime.title.userPreferred +
        //     " - " +
        //     route.params.episode,
        // })}
      />
    </Stack.Navigator>
  );
};
