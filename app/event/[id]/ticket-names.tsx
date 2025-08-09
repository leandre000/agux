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
import { ChevronLeft } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/Header";

export default function TicketNamesScreen() {
  const router = useRouter();
  const { id, count, seats } = useLocalSearchParams<{
    id?: string;
    count?: string;
    seats?: string;
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
    
    router.push(`/event/${id}/payment?${queryParams.toString()}`);
  };

  const canProceed = names.every(name => name.trim().length > 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Ticket Names</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
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