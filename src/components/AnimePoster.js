import React, { PureComponent } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { Badge, Avatar } from "react-native-paper";
import { formatEpisodes } from "../util";

export class EntryAnimePoster extends PureComponent {
  render() {
    const { entry, onPress } = this.props;
    const episodes = formatEpisodes(entry);
    const coverImgUrl = entry.media.coverImage.extraLarge || "";
    const title = entry.media.title.userPreferred || "";

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => onPress()}
        >
          <View>
            <Image source={{ uri: coverImgUrl }} style={styles.pvAnimeImage} />
            <Badge style={{ position: "absolute" }}>{episodes}</Badge>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pvAnimeImage: {
    width: 210,
    height: 320,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    flexDirection: "row",
    width: "75%",
  },
  title: { flex: 1, width: "100%", textAlign: "center", fontSize: 14 },
});
