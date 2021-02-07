import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
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
  totalEps,
} from "../util";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Video } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [fetching, setFetching] = useState(true); //this is regarding gogoanime stuff

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

          anime.media = detailsResponse;

          const rs = calcRanges(detailsResponse);
          setRanges(rs);
          setCurrentFrom(rs[0].from);
          setCurrentTo(rs[0].to);

          await getIdFromGogo(detailsResponse)
            .then((id) => {
              console.log("id is: " + id);
              id && setGogoId(id); //the id can be null.
              setFetching(false);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  if (!details)
    return (
      <Center>
        <ActivityIndicator size="large" color="#00adb5" />
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
          {gogoId ? (
            ranges.length ? (
              <View style={{ flexDirection: "column" }}>
                <EpisodeList
                  from={currentFrom}
                  to={currentTo}
                  gogoId={gogoId}
                  anime={anime}
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
            ) : (
              <Center>
                <Text style={{ color: "#393e46", fontSize: 16 }}>
                  It seems that our provider doesn't have episodes for this
                  anime yet.
                </Text>
              </Center>
            )
          ) : fetching ? (
            <Center>
              <ActivityIndicator size="large" color="#00adb5" />
            </Center>
          ) : (
            <Center>
              <Text style={{ color: "#393e46", fontSize: 16 }}>
                Sorry, we couldn't find this anime ;(.
              </Text>
            </Center>
          )}
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
      progress: 0,
      itemKey: `${this.props.route.params.anime.media.title.romaji}-${this.props.route.params.ep}`,
    };

    (async () => {
      await getEpisodeLinks(this.state.gogoId, this.state.ep).then(
        (linksResponse) => {
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

  _saveProgress = () => {
    console.log("Im a function to save progress every 5 seconds.");
    if (this._video) {
      console.log("the video component ref exists.");
      Platform.OS === "web"
        ? this._saveProgressWeb()
        : this._saveProgressMobile();
    } else {
      console.log("the video component ref doesnt exist.");
    }
  };

  componentDidMount() {
    AsyncStorage.getItem(this.state.itemKey).then((data) => {
      data && this.setState({ ...this.state, progress: JSON.parse(data) });
    });
    this.timerInterval = setInterval(() => this._saveProgress(), 5000);
  }

  componentWillUnmount() {
    AsyncStorage.setItem(this.state.itemKey, this.state.progress.toString());
    clearInterval(this.timerInterval);
  }

  _mountVideoWeb = (component) => {
    this._video = component;
    if (this._video) {
      this._video.currentTime = this.state.progress;
    }
  };

  _mountVideoMobile = (component) => {
    this._video = component;
    console.log("ref was mounted");
    if (this._video) {
      this._changeOptionMobile();
    }
  };

  _changeOptionMobile = () => {
    if (this._video) {
      this._video.loadAsync({ uri: this.state.option.link });
    }
    //this._video.setPositionAsync(this.state.progress);
  };

  _changeOptionWeb = () => {
    this._video.currentTime = this.state.progress;
  };

  _saveProgressWeb = () => {
    if (this._video.currentTime != 0) {
      this.setState({
        ...this.state,
        progress: this._video.currentTime,
      });
    }
  };

  _saveProgressMobile = () => {
    // this._video.getStatusAsync().then((data) => {
    //   console.log("mobile is saving progress " + data.positionMillis);
    //   if (data.positionMillis !== 0) {
    //     this.setState({ ...this.state, progress: data.positionMillis });
    //   }
    // });
  };

  render() {
    //usar el cliente para actualizar la lista
    const { client } = this.context;
    const { navigation } = this.props;
    if (this.state.loading) {
      return (
        <Center>
          <ActivityIndicator size="large" color="#00adb5" />
        </Center>
      );
    } else if (!this.state.links) {
      return (
        <View style={{ backgroundColor: "black", alignContent: "center" }}>
          <View>
            <Text style={{ color: "red" }}>
              No fueron encontrados links para ese capitulo
            </Text>
          </View>
          <ActivityIndicator
            size="large"
            style={{ alignSelf: "center" }}
            color="#00adb5"
          />
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
                key={this.state.videoKey}
                ref={this._mountVideoWeb}
                controls
                height={500}
                src={this.state.option.link}
              />
            </View>
          ) : (
            <Video
              key={this.state.videoKey}
              ref={this._mountVideoMobile}
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
            {this.state.ep < 2 ? null : (
              <Button
                mode="outlined"
                style={{ left: 4, position: "absolute" }}
                onPress={() => {
                  navigation.push("WatchEpisode", {
                    anime: this.state.anime,
                    gogoId: this.state.gogoId,
                    ep: this.state.ep - 1,
                  });
                }}
              >
                <AntDesign name="banckward" size={24} color="white" />
              </Button>
            )}
            {this.state.ep <
            totalEps(
              this.state.anime.media.nextAiringEpisode,
              this.state.anime.media.episodes
            ) ? (
              <Button
                mode="outlined"
                style={{ right: 4, position: "absolute" }}
                onPress={() => {
                  navigation.push("WatchEpisode", {
                    anime: this.state.anime,
                    gogoId: this.state.gogoId,
                    ep: this.state.ep + 1,
                  });
                }}
              >
                <AntDesign name="forward" size={24} color="white" />
              </Button>
            ) : null}
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
                      Platform.OS === "web"
                        ? this._changeOptionWeb()
                        : this._changeOptionMobile();
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
      <Stack.Screen
        name="WatchEpisode"
        component={WatchEpisode}
        options={({ navigation, route }) => ({
          title: `${route.params.anime.media.title.userPreferred} - ${route.params.ep}`,
          headerLeft: () => {
            return (
              <HeaderBackButton
                onPress={() => navigation.navigate("AnimeDetails")}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};
