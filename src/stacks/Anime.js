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
import { Badge, Button, Chip, Modal, Portal } from "react-native-paper";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UpdateEntry } from "../components/UpdateEntry";
import WebView from "react-native-webview";

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
                labelStyle={{
                  fontSize: 18,
                  color: "#00adb5",
                  fontWeight: "bold",
                }}
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
  var [anime, setAnime] = useState(route.params.anime); //cant destructure since anime wont be read-only
  const [details, setDetails] = useState(null);
  const [currentFrom, setCurrentFrom] = useState(0);
  const [currentTo, setCurrentTo] = useState(0);
  const [ranges, setRanges] = useState([]);
  const [gogoId, setGogoId] = useState(null);
  const [fetching, setFetching] = useState(true); //this is regarding gogoanime stuff
  const [updatingEntry, setUpdatingEntry] = useState(false);

  useEffect(() => {
    if (route.params.fromSearch) {
      anime.mediaId = anime.id;
      anime.media = {};

      //this means this route received a search object.
      //look if it exists as an entry in the list.
      if (anime.mediaListEntry) {
        var found = false;
        for (let i = 0; i < client.animeLists.lists.length; i++) {
          if (found) break;

          for (let j = 0; j < client.animeLists.lists[i].entries.length; j++) {
            if (
              client.animeLists.lists[i].entries[j].id ===
              anime.mediaListEntry.id
            ) {
              anime = client.animeLists.lists[i].entries[j];
              found = true;
              break;
            }
          }
        }
      }
    }
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
          setAnime(anime);
          const rs = calcRanges(detailsResponse);
          if (rs) {
            setRanges(rs);
            setCurrentFrom(rs[0].from);
            setCurrentTo(rs[0].to);
          }
          await getIdFromGogo(detailsResponse)
            .then((id) => {
              if (id) setGogoId(id); //the id can be undefined.
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
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <Portal>
        <Modal
          visible={updatingEntry}
          onDismiss={() => setUpdatingEntry(false)}
        >
          <UpdateEntry anime={anime} />
        </Modal>
      </Portal>
      <ScrollView>
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
                  alignContent: "flex-end",
                  justifyContent: "flex-end",
                  flexShrink: 1,
                  marginLeft: 5,
                  marginTop: 5,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    alignContent: "flex-end",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    flexShrink: 1,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "flex-end",
                      textAlign: "left",
                      fontSize: 16,
                    }}
                    numberOfLines={1}
                  >
                    {formatListStatus(anime.status) + formatEpisodes(anime)}
                  </Text>
                  <TouchableOpacity
                    style={{ marginLeft: 5, alignSelf: "flex-end" }}
                    onPress={() => setUpdatingEntry(true)}
                  >
                    <Badge
                      style={{
                        backgroundColor: "#00adb5",
                        color: "#eeeeee",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      Update
                    </Badge>
                  </TouchableOpacity>
                </View>
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
                <View
                  style={{
                    flexDirection: "column",
                    width: "80%",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
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
                            onPress={async () => {
                              setCurrentFrom(range.from);
                              setCurrentTo(range.to);
                            }}
                            textStyle={{ fontSize: 16, fontWeight: "bold" }}
                            style={{ backgroundColor: "#222831" }}
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
    </View>
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
      fakeProgress: 0,
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

  _saveProgressWeb = () => {
    if (this._videoWeb) {
      if (Math.floor(this._videoWeb.currentTime) % 5 === 0) {
        this._saveProgress(this._videoWeb.currentTime);
      }
    }
  };

  componentDidMount() {
    AsyncStorage.getItem(this.state.itemKey).then((data) => {
      const progress = JSON.parse(data);
      data &&
        this.setState({ ...this.state, progress, fakeProgress: progress });
    });
  }

  componentWillUnmount() {
    AsyncStorage.setItem(this.state.itemKey, this.state.progress.toString());
  }

  _saveProgress = (time) => {
    this.setState({
      ...this.state,
      progress: time,
    });
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
                controls
                ref={(ref) => (this._videoWeb = ref)}
                controlsList="nodownload"
                height={500}
                onTimeUpdate={this._saveProgressWeb}
                src={`${this.state.option.link}#t=${this.state.fakeProgress}`}
              />
            </View>
          ) : (
            <WebView
              allowsFullscreenVideo={true}
              style={{
                height: 100,
                width: "100%",
                resizeMode: "cover",
                aspectRatio: 2,
              }}
              mixedContentMode="always"
              injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`}
              onMessage={(message) =>
                this._saveProgress(message.nativeEvent.data)
              }
              androidHardwareAccelerationDisabled={false}
              javaScriptEnabled={true}
              scalesPageToFit={false}
              domStorageEnabled={true}
              source={{
                html: `
                <html>
                  <body>
                    <video
                      id="video" 
                      controls
                      controlsList="nodownload" 
                      src="${this.state.option.link}#t=${this.state.fakeProgress}"
                      />  
                  </body>
                </html>
                <script>
                var vid = document.getElementById("video");
                
                vid.ontimeupdate = function () {
                  if (Math.floor(vid.currentTime) % 5 === 0){
                    window.ReactNativeWebView.postMessage(vid.currentTime.toString());
                  }
                };

                </script>
                <style>
                video{
                  position: fixed;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  max-width: 75%;
                  height: 100%;
                  object-fit: cover;
                }
                </style>
                `,
              }}
            ></WebView>
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
                        fakeProgress: this.state.progress,
                      });
                    }}
                    style={{ marginTop: 10, backgroundColor: "#222831" }}
                    labelStyle={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#eeeeee",
                    }}
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
