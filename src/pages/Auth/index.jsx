import { StyleSheet, Text, View } from 'react-native';
import React from "react";

export const Login = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Sushi Night, watch anime and keep your Anime list synced as you do.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
