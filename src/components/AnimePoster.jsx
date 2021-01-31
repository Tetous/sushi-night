import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Badge, Avatar } from "react-native-paper";
import { formatMediaListEpisodes } from "../util";

export const EntryAnimePoster = ({ Entry, onPress }) => {
  const episodes = formatMediaListEpisodes(Entry.anime);
  const coverImgUrl = Entry.anime.media.coverImage.extraLarge || "";
  const title = Entry.anime.media.title.userPreferred || "";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={() => onPress()}
      >
        <View>
          <Avatar.Image
            source={{ uri: coverImgUrl }}
            style={styles.pvAnimeImage}
          />
          <Badge visible={true} style={{ position: "absolute" }}>
            {episodes}
          </Badge>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
