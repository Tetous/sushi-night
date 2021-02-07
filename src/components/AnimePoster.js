import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { Badge } from "react-native-paper";
import { formatEpisodes } from "../util";

//anime entry of an anime list.
export class EntryAnimePoster extends PureComponent {
  render() {
    const { entry, onPress } = this.props;
    const episodes = formatEpisodes(entry);
    const coverImgUrl = entry.media.coverImage.extraLarge;
    const title = entry.media.title.userPreferred;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => onPress()}
        >
          <View>
            <Image source={{ uri: coverImgUrl }} style={styles.pvAnimeImage} />
            <Badge
              style={{
                position: "absolute",
                backgroundColor: "#222831",
                fontSize: 16,
              }}
            >
              {episodes}
            </Badge>
          </View>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  }
}

//searching for an anime will output this component.
export class SearchAnimePoster extends PureComponent {
  render() {
    const { anime, onPress } = this.props;
    const coverImgUrl = anime.coverImage.extraLarge;
    const title = anime.title.userPreferred;
    const seasonAndYear = `${anime.season} ${anime.seasonYear}`;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => onPress()}
        >
          <View>
            <Image source={{ uri: coverImgUrl }} style={styles.pvAnimeImage} />
            <Badge
              style={{
                position: "absolute",
                backgroundColor: "#222831",
                fontSize: 16,
              }}
            >
              {seasonAndYear}
            </Badge>
          </View>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pvAnimeImage: {
    width: Platform.OS === "web" ? 210 : 120,
    height: Platform.OS === "web" ? 320 : 210,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    flexDirection: "column",
    borderWidth:1,
    borderColor:"#393e46",
    borderRadius:10,
    padding:2
  },
  title: {
    flex: 1,
    width: "90%",
    textAlign: "center",
    fontSize: 14,
    color: "#eeeeee",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
