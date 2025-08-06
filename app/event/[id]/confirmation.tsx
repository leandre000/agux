import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { ChevronLeft } from 'lucide-react-native';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let eventId = params.id;
  if (Array.isArray(eventId)) eventId = eventId[0];
  // For demo, use static values. You can pass real values via params if needed.
  let countParam = params.count;
  if (Array.isArray(countParam)) countParam = countParam[0];
  const ticketCount = parseInt(countParam || '', 10) || 1;
  let amountParam = params.amount;
  if (Array.isArray(amountParam)) amountParam = amountParam[0];
  const amount = parseInt(amountParam || '', 10) || 0;
  let ticketType = params.ticketType || 'vvip tickets';
  if (Array.isArray(ticketType)) ticketType = ticketType[0];
  const eventName = 'baba experience ticket';
  const eventVenue = 'kigali convention center';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo showProfile showSearch />
      <View style={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        <Text style={styles.title}>You have successfully{"\n"}bought tickets</Text>
        <Text style={styles.subtitle}>
          you have now bought {ticketCount} {ticketType}{ticketCount > 1 ? 's' : ''} for{"\n"}
          {eventName} happening at {eventVenue} this weekend enjoy
        </Text>
        <Image source={require('@/assets/images/check.png')} style={styles.checkIcon} />
        <TouchableOpacity style={styles.button} onPress={() => router.push(`/event/${eventId}/ticket-preview?count=${ticketCount}&ticketType=${encodeURIComponent(ticketType)}&amount=${params.amount}`)}>
          <Text style={styles.buttonText}>Go back to Events</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 16,
    zIndex: 2,
  },
  backArrow: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  checkIcon: {
    width: 120,
    height: 120,
    marginBottom: 48,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 0,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
