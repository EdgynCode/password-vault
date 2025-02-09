import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { PasswordContext } from "../../contexts/PasswordContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Backup, Restore } from "../../utils/BackupRestore";
import { lightTheme, darkTheme } from "../../components/theme";

export default function SettingScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setPasswordVisibility } = useContext(PasswordContext);
  const { passwords, loadPasswordInfo } = useContext(PasswordContext);
  const { theme, toggleTheme } = useTheme();

  const [pin, setPin] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [authMethod, setAuthMethod] = useState(null);

  const colors = theme === "dark" ? darkTheme : lightTheme;

  // Load the authentication method from storage when the component mounts
  useEffect(() => {
    const loadAuthMethod = async () => {
      const method = await SecureStore.getItemAsync("authMethod");
      setAuthMethod(method);
    };
    loadAuthMethod();
  }, []);

  const checkPIN = async () => {
    const storedPin = await SecureStore.getItemAsync("user_pin");
    if (pin === storedPin) {
      togglePasswordVisibility();
      setIsModalVisible(false);
    } else {
      Alert.alert("Incorrect PIN", "The PIN you entered is incorrect.");
    }
  };

  const authenticateWithFingerprint = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to view passwords",
      });

      if (result.success) {
        togglePasswordVisibility();
      } else {
        Alert.alert(
          "Authentication Failed",
          "Failed to authenticate using fingerprint."
        );
      }
    } else {
      Alert.alert(
        "Fingerprint Unavailable",
        "Fingerprint authentication is not available on this device."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setPasswordVisibility(!isPasswordVisible);
  };

  const handleShowPasswordToggle = () => {
    if (authMethod === "PIN") {
      setIsModalVisible(true);
    } else if (authMethod === "Fingerprint") {
      authenticateWithFingerprint();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: colors.text }]}>
          Show Passwords
        </Text>
        <Switch
          value={isPasswordVisible}
          onValueChange={handleShowPasswordToggle}
        />
      </View>
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: colors.text }]}>
          Toggle Dark Mode
        </Text>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          thumbColor={colors.primary}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => Backup(passwords)}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Backup Passwords
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => Restore(loadPasswordInfo)}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Restore Passwords
        </Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide">
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.modalBackground },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Enter PIN to Show Passwords
          </Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            style={[
              styles.pinInput,
              { color: colors.text, borderBottomColor: colors.text },
            ]}
          />
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.primary }]}
            onPress={checkPIN}
          >
            <Text
              style={[styles.modalButtonText, { color: colors.buttonText }]}
            >
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: colors.secondary }]}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={[styles.modalButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  optionText: {
    fontSize: 18,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  pinInput: {
    borderBottomWidth: 1,
    width: 150,
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    padding: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "50%",
  },
  modalButtonText: {
    fontSize: 16,
  },
});
