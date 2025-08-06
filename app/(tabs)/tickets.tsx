import React, { useEffect, useState } from "react";
import { Text, ScrollView, RefreshControl } from "react-native";
import EventCard from "@/components/EventCard";
import Colors from "@/constants/Colors";
import { TicketsAPI } from "@/lib/api";

export default function TicketsTabScreen() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const data = await TicketsAPI.getMyTickets();
      setTickets(Array.isArray(data) ? data : data?.tickets || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load your tickets");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
          tintColor={Colors.text}
        />
      }
    >
      <Text
        style={{
          color: Colors.text,
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        My Tickets
      </Text>
      {error ? (
        <Text style={{ color: Colors.error, marginBottom: 12 }}>{error}</Text>
      ) : null}
      {tickets.length === 0 ? (
        <Text style={{ color: Colors.textSecondary }}>
          You have no tickets yet.
        </Text>
      ) : (
        tickets.map((t) => {
          // Minimal mapping for EventCard compatibility if we have event info included
          const event = t.event || {};
          const cardEvent = {
            id: String(t.ticket_id || t.id || Math.random()),
            title: event.title || "Ticket",
            date: event.date || "",
            location: event.venue?.name || event.location || "",
            imageUrl: event.image_url,
            category: event.category || "other",
            isFeatured: false,
            description: t.category?.name
              ? `Category: ${t.category.name}`
              : undefined,
          };
          return <EventCard key={cardEvent.id} event={cardEvent as any} />;
        })
      )}
    </ScrollView>
  );
}
