import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search, Bell, User } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";

export default function TicketNamesScreen() {
  const router = useRouter();
  const { id, count, seats, categoryId, categoryName, price } = useLocalSearchParams<{
    id?: string;
    count?: string;
    seats?: string;
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();
  
  const ticketCount = Math.max(1, parseInt(count || "1", 10));
  const [names, setNames] = useState<string[]>(Array(ticketCount).fill(""));

  const handleNameChange = (idx: number, value: string) => {
    const newNames = [...names];
    newNames[idx] = value;
    setNames(newNames);
  };

  const handleProceed = () => {
    const queryParams = new URLSearchParams();
    queryParams.set("count", String(ticketCount));
    queryParams.set("names", names.join(","));
    if (seats) queryParams.set("seats", seats);
    if (categoryId) queryParams.set("categoryId", categoryId);
    if (categoryName) queryParams.set("categoryName", categoryName);
    if (price) queryParams.set("price", price);
    
    router.push(`/event/${id}/payment?${queryParams.toString()}`);
  };

  const canProceed = names.every(name => name.trim().length > 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      
      {/* Custom Header matching the design */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Ticket Names</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Blue border container */}
          <View style={styles.formContainer}>
            <Text style={styles.instructionText}>
              Please enter the names for your tickets
            </Text>
            
            {Array.from({ length: ticketCount }).map((_, idx) => (
              <View key={idx} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ticket {idx + 1} names</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter name for ticket ${idx + 1}`}
                  placeholderTextColor={Colors.textSecondary}
                  value={names[idx]}
                  onChangeText={(value) => handleNameChange(idx, value)}
                  autoCapitalize="words"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.proceedButton, !canProceed && styles.proceedButtonDisabled]}
            onPress={handleProceed}
            disabled={!canProceed}
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginRight: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'rgba(230, 0, 126, 0.05)',
  },
  instructionText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    opacity: 0.5,
  },
  proceedButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});