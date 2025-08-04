import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';

export default function TicketNamesScreen() {
  const router = useRouter();
  const { id, count } = useLocalSearchParams<{ id?: string; count?: string }>();
  const ticketCount = Math.max(1, parseInt(count || '1', 10));
  const [names, setNames] = useState<string[]>(Array(ticketCount).fill(''));

  const handleNameChange = (idx: number, value: string) => {
    const newNames = [...names];
    newNames[idx] = value;
    setNames(newNames);
  };

  const handleProceed = () => {
    // Proceed to payment (implement navigation as needed)
    router.push(`/event/${id}/payment?count=${ticketCount}&names=${encodeURIComponent(names.join(','))}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo showProfile showSearch />
      {/* Back and Title */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.eventTitle}>Choose Ticket Names</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputsContainer}>
          {Array.from({ length: ticketCount }).map((_, idx) => (
            <TextInput
              key={idx}
              style={styles.input}
              placeholder={`Ticket ${idx + 1} names`}
              placeholderTextColor={Colors.textSecondary}
              value={names[idx]}
              onChangeText={value => handleNameChange(idx, value)}
            />
          ))}
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleProceed} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Proceed to Payment</Text>
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
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoFirst: {
    color: Colors.text,
  },
  logoSecond: {
    color: Colors.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: Colors.card,
    backgroundColor: Colors.textSecondary,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: Colors.textSecondary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inputsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    color: Colors.text,
    fontSize: 16,
    marginBottom: 0,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: Dimensions.get('window').width - 32,
    alignSelf: 'center',
  },
  nextBtnText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
