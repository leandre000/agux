import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Search,
  Sliders,
  Grid3X3,
  List
} from "lucide-react-native";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useEventsStore } from "@/store/events-store";
import { useAuthStore } from "@/store/auth-store";

export default function EventsUserScreen() {
  const router = useRouter();
  const { allEvents, fetchAll, loading, error } = useEventsStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await fetchAll();
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, [fetchAll]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleFilterPress = () => {
    setShowFilters(!showFilters);
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const filteredEvents = allEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventItem = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      variant={viewMode === "grid" ? "compact" : "list"}
      onPress={() => handleEventPress(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Calendar size={48} color={Colors.textSecondary} />
      </View>
      <Text style={styles.emptyStateTitle}>No events found</Text>
      <Text style={styles.emptyStateMessage}>
        {searchQuery
          ? `No events match "${searchQuery}". Try adjusting your search.`
          : "There are no events available at the moment."}
      </Text>
      {searchQuery && (
        <Button
          title="Clear Search"
          variant="outline"
          onPress={() => setSearchQuery("")}
          style={styles.clearSearchButton}
        />
      )}
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
          <Text style={styles.filterChipText}>All Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
          <Text style={styles.filterChipText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
          <Text style={styles.filterChipText}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip} activeOpacity={0.7}>
          <Text style={styles.filterChipText}>Free</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Events" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Events" showBack />
      
      <View style={styles.content}>
        {/* Search and Controls */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search events, venues, or categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilter={handleFilterPress}
            showFilter={true}
          />
        </View>

        {/* View Mode Toggle */}
        <View style={styles.controlsSection}>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === "list" && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode("list")}
              activeOpacity={0.7}
            >
              <List size={20} color={viewMode === "list" ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === "grid" && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode("grid")}
              activeOpacity={0.7}
            >
              <Grid3X3 size={20} color={viewMode === "grid" ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        {showFilters && renderFilters()}

        {/* Events List */}
        <View style={styles.eventsSection}>
          <SectionHeader
            title={`${filteredEvents.length} Events`}
            subtitle={searchQuery ? `Results for "${searchQuery}"` : "Discover amazing events"}
            showSeeAll={false}
          />
          
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEventItem}
            key={viewMode}
            numColumns={viewMode === "grid" ? 2 : 1}
            columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
            contentContainerStyle={styles.eventsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyState}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
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
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  controlsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  viewModeToggle: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    alignSelf: "flex-start",
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
  },
  viewModeButtonActive: {
    backgroundColor: "rgba(230, 0, 126, 0.1)",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  eventsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventsList: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  itemSeparator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyStateIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  clearSearchButton: {
    minWidth: 120,
  },
});
