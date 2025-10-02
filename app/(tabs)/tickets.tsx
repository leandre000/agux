import Button from "@/components/Button";
import Header from "@/components/Header";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { useTicketsStore } from "@/store/tickets-store";
import { useRouter } from "expo-router";
import {
    ArrowRight,
    Calendar,
    Clock3,
    Download,
    MapPin,
    Share2,
    Ticket
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TicketsScreen() {
  const router = useRouter();
  const { userTickets, loading, fetchUserTickets } = useTicketsStore();

  useEffect(() => {
    fetchUserTickets().catch(() => {});
  }, [fetchUserTickets]);

  const activeTickets = userTickets.filter(ticket => ticket.status === "active");
  const expiredTickets = userTickets.filter(ticket => ticket.status === "expired");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTicketPress = (ticketId: string) => {
    // For now, just log the ticket press since we don't have a dedicated ticket detail screen
    console.log("Viewing ticket:", ticketId);
  };

  const handleDownloadTicket = (ticket: any) => {
    // Implement ticket download functionality
    console.log("Downloading ticket:", ticket.id);
  };

  const handleShareTicket = (ticket: any) => {
    // Implement ticket sharing functionality
    console.log("Sharing ticket:", ticket.id);
  };

  const renderTicketCard = (ticket: any) => (
    <TouchableOpacity
      key={ticket.id}
      style={[
        styles.ticketCard,
        ticket.status === "expired" && styles.expiredTicketCard,
      ]}
      onPress={() => handleTicketPress(ticket.id)}
      activeOpacity={0.8}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.ticketTypeContainer}>
          <Ticket size={20} color={Colors.primary} />
          <Text style={styles.ticketType}>{ticket.category_name || "Standard"}</Text>
        </View>
        <View style={styles.ticketStatus}>
          <View style={[
            styles.statusDot,
            ticket.status === "active" ? styles.statusActive : styles.statusExpired
          ]} />
          <Text style={[
            styles.statusText,
            ticket.status === "active" ? styles.statusTextActive : styles.statusTextExpired
          ]}>
            {ticket.status === "active" ? "Active" : "Expired"}
          </Text>
        </View>
      </View>

      <Text style={styles.eventTitle}>{ticket.event_title || "Event"}</Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {formatDate(ticket.event_date)} at {formatTime(ticket.event_date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{ticket.venue || ""}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock3 size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {ticket.status === "active" ? "Event hasn't started" : "Event has ended"}
          </Text>
        </View>
      </View>

      <View style={styles.ticketFooter}>
        <View style={styles.ticketNumber}>
          <Text style={styles.ticketNumberLabel}>Ticket #</Text>
          <Text style={styles.ticketNumberValue}>{ticket.ticket_id}</Text>
        </View>
        
        <View style={styles.ticketActions}>
          {ticket.status === "active" && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDownloadTicket(ticket)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Download size={18} color={Colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShareTicket(ticket)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Share2 size={18} color={Colors.primary} />
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleTicketPress(ticket.id)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowRight size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="My Tickets" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Ticket size={32} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <Text style={styles.headerSubtitle}>
            {activeTickets.length} active tickets
          </Text>
        </View>

        {/* Loading state */}
        {loading && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loading Tickets</Text>
            <Skeleton height={120} radius={16} style={{ marginBottom: 12 }} />
            <Skeleton height={120} radius={16} style={{ marginBottom: 12 }} />
            <Skeleton height={120} radius={16} style={{ marginBottom: 12 }} />
          </View>
        )}

        {/* Active Tickets */}
        {!loading && activeTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Tickets</Text>
            {activeTickets.map(renderTicketCard)}
          </View>
        )}

        {/* Expired Tickets */}
        {!loading && expiredTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Events</Text>
            {expiredTickets.map(renderTicketCard)}
          </View>
        )}

        {/* Empty State */}
        {!loading && userTickets.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ticket size={48} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No Tickets Yet</Text>
            <Text style={styles.emptyMessage}>
              You haven't purchased any tickets yet. Start exploring events to get your first ticket!
            </Text>
            <Button
              title="Browse Events"
              variant="primary"
              size="large"
              fullWidth={true}
              onPress={() => router.push("/(tabs)/events-user")}
              style={styles.browseButton}
            />
          </View>
        )}

        {/* Call to Action */}
        {!loading && userTickets.length > 0 && (
          <View style={styles.ctaSection}>
            <Button
              title="Browse More Events"
              variant="outline"
              size="large"
              fullWidth={true}
              onPress={() => router.push("/(tabs)/events-user")}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 20,
  },
  ticketCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  expiredTicketCard: {
    opacity: 0.6,
    backgroundColor: "#f8f9fa",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ticketTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketType: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    textTransform: "uppercase",
  },
  ticketStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: "#10b981",
  },
  statusExpired: {
    backgroundColor: "#6b7280",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  statusTextActive: {
    color: "#10b981",
  },
  statusTextExpired: {
    color: "#6b7280",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  eventDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  ticketNumber: {
    flex: 1,
  },
  ticketNumberLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ticketNumberValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "monospace",
  },
  ticketActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(230, 0, 126, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(230, 0, 126, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    minWidth: 200,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
});