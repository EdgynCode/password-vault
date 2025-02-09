import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NoteContext } from "../../contexts/NoteContext";
import { SecureNotes } from "../../models";
import { addSecureNote, updateNote } from "../../db/database";
import { useTheme } from "../../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../../components/theme";

export default function AddNoteScreen({ navigation, route }) {
  const { loadSecureNotes } = useContext(NoteContext);
  const [id, setID] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    if (route.params?.item) {
      const { title, content, category, id } = route.params.item;
      setTitle(title);
      setContent(content);
      setCategory(category);
      setID(id);
      setIsEditing(true);
    }
  }, [route.params?.item]);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Please fill out both fields");
      return;
    }

    if (isEditing) {
      try {
        await updateNote(id, title, content, category);
        Alert.alert("Success", "Note updated successfully");
        loadSecureNotes();
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "Failed to update info");
        console.error("Error updating info: ", error);
      }
    } else {
      try {
        let note = new SecureNotes(id, title, content, category);
        await addSecureNote(note);
        Alert.alert("Success", "Note added successfully");
        loadSecureNotes();
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "Failed to add note");
        console.error("Error adding note: ", error);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.label}>Note Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter note title"
      />
      <Text style={styles.label}>Note Content</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="Enter note content"
        multiline
        numberOfLines={5}
      />
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Enter category"
      />
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
  },
});
