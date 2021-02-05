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
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useRef } from "react";
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

class WatchEpisode extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      links: null,
      option: null,
      videoKey: 0,
      anime: this.props.route.params.anime,
      gogoId: this.props.route.params.gogoId,
      ep: this.props.route.params.ep,
      loading: true,
    };

    (async () => {
      console.log(
        `${this.state.gogoId} ${this.state.ep} ${this.state.anime.id}`
      );
      await getEpisodeLinks(this.state.gogoId, this.state.ep).then(
        (linksResponse) => {
          console.log(JSON.stringify(linksResponse));
          this.setState({
            ...this.state,
            links: linksResponse,
            option: linksResponse[0],
            loading: false,
          });
        }
      );
    })();
  }

  _mountVideoWeb = (component) => {
    this._video = component;
    this._video.src = this.state.option.link;
  };

  _mountVideoMobile = (component) => {
    this._video = component;
    this._changeOption();
  };

  _changeOption() {
    if (this._video) {
      this._video.loadAsync({ uri: this.state.option.link });
    }
  }

  _saveProgress() {
    if (this._video){
      console.log("progress " + this._video.currentTime);
    }
  }

  render() {
    //usar el cliente para actualizar la lista
    const { client } = this.context;

    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    } else if (!this.state.links) {
      return (
        <View style={{ backgroundColor: "black", alignContent: "center" }}>
          <View>
            <Text style={{ color: "red" }}>
              No fueron encontrados links para ese capitulo
            </Text>
          </View>
          <ActivityIndicator size="large" style={{ alignSelf: "center" }} />
        </View>
      );
    } else if (!this.state.links.length) {
      return (
        <View style={{ backgroundColor: "black", alignContent: "center" }}>
          <Text style={{ color: "white", fontSize: 30 }}>
            There are no links yet for this episode.
          </Text>
        </View>
      );
    } else {
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
              <video
                ref={this._mountVideoWeb}
                controls
                height={500}
                onTimeUpdate={this._saveProgress}
              />
            </View>
          ) : (
            <Video
              ref={this._mountVideoMobile}
              resizeMode="contain"
              useNativeControls={true}
              style={{ width: "90%", height: 300, alignSelf: "center" }}
            />
          )}
          <View
            style={{
              justifyContent: "space-around",
              flexDirection: "row",
              marginTop: 8,
            }}
          >
            <Button mode="outlined" style={{ left: 4, position: "absolute" }}>
              <AntDesign name="banckward" size={24} color="white" />
            </Button>
            <Button mode="outlined" style={{ right: 4, position: "absolute" }}>
              <AntDesign name="forward" size={24} color="white" />
            </Button>
          </View>
          <View style={{ flex: 1, flexDirection: "column", marginTop: 40 }}>
            <View
              style={{
                alignSelf: "center",
                width: "80%",
                justifyContent: "center",
                marginBottom: Platform.OS === "web" ? 10 : 0,
              }}
            >
              {this.state.links.map((option) => {
                return (
                  <Button
                    key={option.link}
                    mode="contained"
                    onPress={() => {
                      this.setState({
                        ...this.state,
                        option: option,
                        videoKey: this.state.videoKey + 1,
                      });
                      this._changeOption();
                    }}
                    style={{ marginTop: 10 }}
                    labelStyle={{ fontSize: 16, fontWeight: "bold" }}
                  >
                    {option.quality}
                  </Button>
                );
              })}
            </View>
          </View>
        </View>
      );
    }
  }
}

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
      <Stack.Screen name="WatchEpisode" component={WatchEpisode} />
    </Stack.Navigator>
  );
};
