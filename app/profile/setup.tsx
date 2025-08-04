import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Header from '@/components/Header';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');

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
      setValidationError('Please fill in all fields');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    updateUser({
      username: firstName + ' ' + lastName,
      profileImage: profileImage || undefined,
    });
    router.push('/profile/categories');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Personal Information" showBack />
      <View style={styles.content}>
        <Text style={styles.description}>
          Please fill in with your personal information
        </Text>
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
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
            error={validationError}
          />
          <Input
            placeholder="LastName"
            value={lastName}
            onChangeText={setLastName}
            error={validationError}

          />
        </View>
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.card,
  },
  profileImagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.card,
  },
  addPhotoText: {
    color: Colors.primary,
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
    
    paddingRight: 16,
  },
  nextButton: {
    width: '100%',
    borderRadius: 28,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
});
