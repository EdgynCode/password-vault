import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Feature({ icon, text }) {
  return (
    <View style={styles.feature}>
      <Image source={icon} style={styles.featureIcon} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
  },
});
