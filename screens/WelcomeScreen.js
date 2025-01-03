import React, { useContext } from "react";
import Feature from "../components/Feature";
import i18n from "../components/Translations";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { LanguageContext } from "../contexts/LanguageContext";

export default function WelcomeScreen({ navigation }) {
  const { language } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/vault.png")} style={styles.logo} />
      <Text style={styles.title}>{i18n.t("welcome")}</Text>
      <Text style={styles.subtitle}>{i18n.t("secure")}</Text>

      <View style={styles.features}>
        <Feature
          icon={require("../assets/padlock.png")}
          text={i18n.t("description1")}
        />
        <Feature
          icon={require("../assets/cross-platform.png")}
          text={i18n.t("description2")}
        />
        <Feature
          icon={require("../assets/fingerprint.png")}
          text={i18n.t("description3")}
        />
        <Feature
          icon={require("../assets/secure-password.png")}
          text={i18n.t("description4")}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GetInfo")}
      >
        <Text style={styles.buttonText}>{i18n.t("get_started")}</Text>
      </TouchableOpacity>

      <Text style={styles.privacyText}>{i18n.t("privacy_text")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  features: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0377BC",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
