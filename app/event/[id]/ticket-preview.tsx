import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useEventsStore } from "@/store/events-store";
import { useTicketsStore } from "@/store/tickets-store";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TicketPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let eventId = params.id;
  if (Array.isArray(eventId)) eventId = eventId[0];
  let ticketId = params.ticketId;
  if (Array.isArray(ticketId)) ticketId = ticketId[0];
  
  const { userTickets } = useTicketsStore();
  const { allEvents } = useEventsStore();
  
  // Find the specific ticket
  const ticket = userTickets.find(t => t.ticket_id === ticketId || t.id === ticketId) || userTickets[0];
  const event = allEvents.find(e => e.id === eventId);
  
  const ticketType = ticket?.category_name || 'Standard';
  const amount = ticket?.price || 0;
  const holderName = ticket?.holder_name || 'Guest';

  // Use real data from backend
  const eventName = event?.title || 'Event';
  const venue = event?.location || 'Venue TBD';
  const boughtAt = ticket?.purchase_date ? new Date(ticket.purchase_date).toLocaleTimeString() : 'N/A';
  const date = event?.date ? new Date(event.date).toLocaleDateString() : 'TBD';

  // Generate a unique QR code value from ticket data
  const qrValue = ticket?.qr_code || JSON.stringify({
    ticketId: ticket?.ticket_id || ticketId,
    eventId,
    holderName,
    timestamp: Date.now(),
  });

  // PDF download handler
  const handleDownloadTicket = async () => {
    try {
      const html = `
        <html>
          <body style="font-family: Arial; padding: 0; margin: 0; background: #000; color: #fff;">
            <div style="width: 100vw; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <h2 style="color: #e6007e; margin-bottom: 8px;">${eventName}</h2>
              <div style="margin-bottom: 16px;">
                <img src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}' width="180" height="180" />
              </div>
              <div style="background: #18181b; border-radius: 16px; padding: 18px 24px; width: 320px;">
                <div style="font-weight: bold; color: #e6007e; font-size: 18px; margin-bottom: 8px;">${eventName}</div>
                <div style="font-size: 15px; color: #fff; margin-bottom: 4px;">${ticketType} (1)</div>
                <div style="font-size: 15px; color: #fff; margin-bottom: 4px;">${venue}</div>
                <div style="font-size: 15px; color: #fff; margin-bottom: 4px;">Amount: ${amount} Rwf</div>
                <div style="font-size: 14px; color: #fff; margin-bottom: 2px;">Bought at: ${boughtAt}</div>
                <div style="font-size: 14px; color: #fff;">Date: ${date}</div>
              </div>
            </div>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'android') {
        // Save to Downloads using StorageAccessFramework
        const permissions = await MediaLibrary.requestPermissionsAsync();
        if (permissions.status !== 'granted') {
          Alert.alert('Permission required', 'Please grant storage permission to save the ticket.');
          return;
        }
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        Alert.alert('Ticket Saved', 'Your ticket PDF has been saved to your Downloads folder.');
      } else if (Platform.OS === 'ios') {
        const dest = `${FileSystem.documentDirectory}ticket_${eventId}_${Date.now()}.pdf`;
        await FileSystem.copyAsync({ from: uri, to: dest });
        await Sharing.shareAsync(dest);
      } else {
        window.open(uri, '_blank');
      }
    } catch {
      Alert.alert('Error', 'Could not generate PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header showLogo showProfile showSearch />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Ticket Preview</Text>
        </View>
        <View style={styles.cardWrap}>
          <View style={styles.qrWrap}>
            <QRCode
              value={qrValue}
              size={width * 0.55}
              color={Colors.primary}
              backgroundColor={Colors.background}
            />
          </View>
          <View style={styles.ticketInfo}>
            <Text style={styles.eventName}>{eventName}</Text>
                                    <Text style={styles.ticketType}>{ticketType}</Text>
                        <Text style={styles.ticketType}>Holder: {holderName}</Text>
                        <Text style={styles.venue}>{venue}</Text>
                        <Text style={styles.amount}>Amount: {amount.toLocaleString()} RWF</Text>
            <Text style={styles.meta}>Bought at: {boughtAt}</Text>
            <Text style={styles.meta}>Date: {date}</Text>
          </View>
        </View>
        <View style={styles.quickActionWrap}>
          <Text style={styles.quickActionTitle}>Quick Action</Text>
          <View style={styles.quickActionRow}>
            <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push(`/event/${eventId}/menu`)}>
              <View style={styles.quickActionIconWrap}>
                <MaterialCommunityIcons name="food-fork-drink" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Place foods and drinks order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn} onPress={handleDownloadTicket}>
              <View style={[styles.quickActionIconWrap, styles.downloadIconWrap]}>
                <Feather name="download" size={28} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Download Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  cardWrap: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: width * 0.70,
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  qrWrap: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 9,
    marginBottom: 18,
  },
  ticketInfo: {
    alignItems: 'flex-start',
      width: '100%',
      alignSelf: 'center',
    marginTop: 6,
  },
  eventName: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
  },
  ticketType: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  venue: {
    color: Colors.text,
    fontSize: 15,
    marginBottom: 2,
  },
  amount: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  meta: {
    color: Colors.text,
    fontSize: 14,
    marginBottom: 2,
  },
  quickActionWrap: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 24,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  quickActionTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 18,
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quickActionIconWrap: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  downloadIconWrap: {
    backgroundColor: '#e6007e',
  },
  quickActionIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  quickActionText: {
    color: Colors.text,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
});
