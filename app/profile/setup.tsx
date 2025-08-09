import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!firstName || !lastName) {
      setValidationError("Please fill in all fields");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    updateUser({
      username: firstName + " " + lastName,
      profileImage: profileImage || undefined,
    });
    router.push("/profile/categories");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header title="Personal Information" showBack />
      <View style={styles.content}>
        <Text style={styles.description}>
          Please fill in with your personal information
        </Text>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={pickImage}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder} />
          )}
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Input
            placeholder="FirstName"
            value={firstName}
            onChangeText={setFirstName}
            error={validationError && !firstName ? validationError : ""}
            style={styles.input}
          />
          <Input
            placeholder="LastName"
            value={lastName}
            onChangeText={setLastName}
            error={validationError && !lastName ? validationError : ""}
            style={styles.input}
          />
        </View>
        <Button title="Next" onPress={handleNext} style={styles.nextButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 32,
    textAlign: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#333',
  },
  profileImagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#333',
  },
  addPhotoText: {
    color: '#E6007E',
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#fff",
  },
  nextButton: {
    width: "100%",
    borderRadius: 25,
    paddingVertical: 16,
    backgroundColor: '#E6007E',
    alignSelf: "center",
  },
});