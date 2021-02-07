import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
  TextInput,
  TouchableHighlight,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MediaListStatus } from "anilist-wrapper";
import { totalEps } from "../util";

export const UpdateEntry = ({ anime }) => {
  //check if it has mediaentry id.
  var [status, setStatus] = useState(anime.status || MediaListStatus.Planning);
  var [score, setScore] = useState(anime.score || 0);
  var [progress, setProgress] = useState(anime.progress || 0);

  var totalEpisodes = totalEps(
    anime.media.nextAiringEpisode,
    anime.media.episodes
  );

  var dropDownEpisodes = [];

  for (let i = 0; i <= totalEpisodes; i++) {
    dropDownEpisodes.push({
      label: i.toString(),
      value: i,
    });
  }

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#222831",
        alignSelf: "center",
        width: "50%",
        padding:10
      }}
    >
      <View style={{ flexDirection: "row",zIndex:6 }}>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Status
          </Text>
          <DropDownPicker
            items={[
              { label: "Currently watching", value: MediaListStatus.Current },
              { label: "Completed", value: MediaListStatus.Completed },
              { label: "Paused", value: MediaListStatus.Paused },
              { label: "Planning to watch", value: MediaListStatus.Planning },
              { label: "Dropped", value: MediaListStatus.Dropped },
            ]}
            defaultValue={status}
            containerStyle={{ height: 40 }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            activeLabelStyle={{ color: "#eeeeee" }}
            labelStyle={{ color: "#00adb5", fontSize: 16 }}
            dropDownStyle={{ backgroundColor: "#393e46", borderColor: null }}
            onChangeItem={(item) => setStatus(item.value)}
            style={{
              backgroundColor: "#222831",
              borderColor: null,
              width: "100%",
              marginBottom: 4,
            }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Score
          </Text>
          <DropDownPicker
            items={[
              { label: "0", value: 0 },
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
              { label: "5", value: 5 },
              { label: "6", value: 6 },
              { label: "7", value: 7 },
              { label: "8", value: 8 },
              { label: "9", value: 9 },
              { label: "10", value: 10 },
            ]}
            defaultValue={score}
            containerStyle={{ height: 40 }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            activeLabelStyle={{ color: "#eeeeee" }}
            labelStyle={{ color: "#00adb5", fontSize: 16 }}
            dropDownStyle={{ backgroundColor: "#393e46", borderColor: null }}
            onChangeItem={(item) => setScore(item.value)}
            style={{
              backgroundColor: "#222831",
              borderColor: null,
              width: "100%",
              marginBottom: 4,
            }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Episode Progress
          </Text>
          <DropDownPicker
            items={dropDownEpisodes}
            defaultValue={progress}
            containerStyle={{ height: 40 }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            activeLabelStyle={{ color: "#eeeeee" }}
            labelStyle={{ color: "#00adb5", fontSize: 16 }}
            dropDownStyle={{ backgroundColor: "#393e46", borderColor: null }}
            onChangeItem={(item) => setProgress(item.value)}
            style={{
              backgroundColor: "#222831",
              borderColor: null,
              width: "100%",
              marginBottom: 4,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: 5,
          flexDirection: "row",
          alignSelf: "flex-end",
          alignContent: "flex-end",
          justifyContent: "flex-end",
          right: 0,
          padding: 10,
        }}
      >
        <TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#f14e4e",
              padding: 10,
              marginRight:5
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Delete</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#338ef8",
              padding: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
