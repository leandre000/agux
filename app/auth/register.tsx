import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Header from "@/components/Header";
import SocialLoginButton from "@/components/SocialLoginButton";
import AuthGuard from "@/components/AuthGuard";
import Colors from "@/constants/Colors";

export default function RegisterScreen() {
  const router = useRouter();
  const goEmail = () => router.push("/auth/register-email");
  const goPhone = () => router.push("/auth/register-phone");
  const goLogin = () => router.push("/auth/login");

  const handleRegisterWithGoogle = () => goEmail();

  return (
    <AuthGuard requireGuest redirectTo="/(tabs)">
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Header title="Create Account" showBack />
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={require("@/assets/images/icon.png")}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text style={styles.title}>
              Buy your <Text style={styles.highlight}>Event ticket</Text> with
              {"\n"}Agura Platform
            </Text>
            <Text style={styles.description}>
              Sign up to our app and start buying your ticket easily and faster
            </Text>
            <View style={styles.socialButtonsContainer}>
              <SocialLoginButton
                provider="google"
                onPress={handleRegisterWithGoogle}
                style={styles.socialButton}
              />
              <SocialLoginButton
                provider="gmail"
                onPress={goEmail}
                style={styles.socialButton}
              />
              <SocialLoginButton
                provider="phone"
                onPress={goPhone}
                style={styles.socialButton}
              />
            </View>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={goLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
  },
  imageContainer: {
    width: 260,
    height: 260,
    borderRadius: 36,
    overflow: "hidden",
    marginBottom: 32,
    alignSelf: "center",
    backgroundColor: Colors.card,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  highlight: {
    color: Colors.primary,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  socialButtonsContainer: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center",
  },
  socialButton: {
    backgroundColor: Colors.white,
    marginBottom: 14,
    paddingVertical: 6.8,
    paddingHorizontal: 18,
    borderRadius: 28,
    minWidth: 316.8,
    maxWidth: 460.8,
    alignSelf: "center",
    elevation: 2,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
