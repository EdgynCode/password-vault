import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { insertPasswordInfo, updatePasswordInfo } from "../../db/database";
import { PasswordInfo } from "../../models/PasswordInfo";
import { PasswordContext } from "../../contexts/PasswordContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../../components/theme";

export default function AddPasswordScreen({ navigation, route }) {
  const { loadPasswordInfo } = useContext(PasswordContext);
  const [id, setID] = useState("");
  const [appname, setAppname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const generatePassword = (length = 12) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length > 7) strength += 1; // At least 8 characters
    if (password.match(/[A-Z]/)) strength += 1; // Has uppercase letter
    if (password.match(/[0-9]/)) strength += 1; // Has a number
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1; // Has special character

    return strength;
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setStrength(checkPasswordStrength(text));
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "Too Short";
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 1:
        return "red";
      case 2:
        return "brown";
      case 3:
        return "orange";
      case 4:
        return "green";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    if (route.params?.item) {
      const { appname, username, password, category, id } = route.params.item;
      setAppname(appname);
      setUsername(username);
      setPassword(password);
      setCategory(category);
      setID(id);
      setIsEditing(true);
    }
  }, [route.params?.item]);

  const handleSave = async () => {
    if (!appname || !username || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (isEditing) {
      try {
        await updatePasswordInfo(id, appname, username, password, category);
        Alert.alert("Success", "Info updated successfully");
        loadPasswordInfo();
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "Failed to update info");
        console.error("Error updating info: ", error);
      }
    } else {
      try {
        let passwordInfo = new PasswordInfo(
          id,
          appname,
          username,
          password,
          category
        );
        await insertPasswordInfo(passwordInfo);
        Alert.alert("Success", "Info added successfully");
        loadPasswordInfo();
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "Failed to add info");
        console.error("Error adding info: ", error);
      }
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {isEditing ? "Edit" : "Add"} Password
      </Text>
      <Text style={[styles.label, { color: colors.text }]}>
        App or Site Name
      </Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={appname}
        onChangeText={setAppname}
      />
      <Text style={[styles.label, { color: colors.text }]}>Username</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={[styles.label, { color: colors.text }]}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.eyeContainer}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <Text style={{ color: getStrengthColor() }}>{getStrengthLabel()}</Text>

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.functionButtonContainer}>
        <TouchableOpacity
          style={[styles.functionButton, { backgroundColor: colors.primary }]}
          onPress={handleGeneratePassword}
        >
          <Text
            style={[styles.functionButtonText, { color: colors.buttonText }]}
          >
            Auto Generate Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text
            style={[styles.functionButtonText, { color: colors.buttonText }]}
          >
            {isEditing ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 1,
  },
  eyeContainer: {
    padding: 8,
  },
  functionButtonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 100,
  },
  functionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  functionButtonText: {
    fontSize: 18,
  },
});
