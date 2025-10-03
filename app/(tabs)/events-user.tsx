import Button from "@/components/Button";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Filter,
  Grid3X3,
  List,
  Sliders,
  Star,
  Users,
  X
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterOption = {
  id: string;
  label: string;
  value: string;
};

type SortOption = {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

export default function EventsUserScreen() {
  const router = useRouter();
  const { allEvents, fetchAll, loading, error } = useEventsStore();
  const { user } = useAuthStore();

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("date");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [selectedDate, setSelectedDate] = useState<string>("all");

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

  // Debounce search query updates
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsDebouncing(true);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setIsDebouncing(false);
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSearch = () => {
    if (debouncedQuery) {
      // In future, trigger remote search endpoint here
      console.log('Searching for:', debouncedQuery);
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

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
    setShowSortModal(false);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setPriceRange({ min: 0, max: 1000 });
    setSelectedDate("all");
  };

  const filterOptions: FilterOption[] = [
    { id: "free", label: "Free Events", value: "free" },
    { id: "today", label: "Today", value: "today" },
    { id: "weekend", label: "This Weekend", value: "weekend" },
    { id: "month", label: "This Month", value: "month" },
    { id: "music", label: "Music", value: "music" },
    { id: "sports", label: "Sports", value: "sports" },
    { id: "tech", label: "Technology", value: "tech" },
    { id: "business", label: "Business", value: "business" },
    { id: "other", label: "Other", value: "other" },
  ];

  const sortOptions: SortOption[] = [
    { id: "date", label: "Date (Earliest)", value: "date", icon: <Calendar size={16} color={Colors.text} /> },
    { id: "date-desc", label: "Date (Latest)", value: "date-desc", icon: <Calendar size={16} color={Colors.text} /> },
    { id: "price", label: "Price (Low to High)", value: "price", icon: <DollarSign size={16} color={Colors.text} /> },
    { id: "price-desc", label: "Price (High to Low)", value: "price-desc", icon: <DollarSign size={16} color={Colors.text} /> },
    { id: "rating", label: "Rating (High to Low)", value: "rating", icon: <Star size={16} color={Colors.text} /> },
    { id: "popularity", label: "Popularity", value: "popularity", icon: <Users size={16} color={Colors.text} /> },
  ];

  const recentSearches = [
    "music festival",
    "tech conference",
    "food expo",
    "art exhibition"
  ];

  const popularSearches = [
    "summer events",
    "live music",
    "sports games",
    "business networking"
  ];

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = allEvents.filter((event) => {
      const query = debouncedQuery.toLowerCase();
      const matchesSearch = query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        (event.description?.toLowerCase() || "").includes(query) ||
        event.location.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Apply filters
      if (selectedFilters.includes("free") && (event.price ?? 0) > 0) return false;
      if (selectedFilters.includes("today") && !isToday(new Date(event.date))) return false;
      if (selectedFilters.includes("music") && event.category !== "music") return false;
      if (selectedFilters.includes("tech") && event.category !== "tech") return false;
      if (selectedFilters.includes("sports") && event.category !== "sports") return false;
      if (selectedFilters.includes("business") && event.category !== "business") return false;
      if (selectedFilters.includes("other") && event.category !== "other") return false;

      // Apply price range filter
      if (event.price !== undefined && (event.price < priceRange.min || event.price > priceRange.max)) return false;

      return true;
    });

    // Apply sorting
    const sortedEvents = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-desc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "popularity":
          return (b.attendees ?? 0) - (a.attendees ?? 0);
        default:
          return 0;
      }
    });

    return sortedEvents;
  }, [allEvents, debouncedQuery, selectedFilters, selectedSort, priceRange, selectedDate, isToday]);

  const renderLoadingSkeletons = () => (
    <View style={{ paddingHorizontal: 20 }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <View key={idx} style={{ marginBottom: 16 }}>
          <Skeleton height={180} radius={16} />
        </View>
      ))}
    </View>
  );

  const renderEventItem = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      variant={viewMode === "grid" ? "compact" : "default"}
      onPress={() => handleEventPress(item.id)}
      onFavorite={() => console.log("Favorite", item.id)}
      onShare={() => console.log("Share", item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Calendar size={48} color={Colors.textSecondary} />
      </View>
      <Text style={styles.emptyStateTitle}>No events found</Text>
      <Text style={styles.emptyStateMessage}>
        {searchQuery || selectedFilters.length > 0
          ? "No events match your current filters. Try adjusting your search or filters."
          : "There are no events available at the moment."}
      </Text>
      {(searchQuery || selectedFilters.length > 0) && (
        <Button
          title="Clear All Filters"
          variant="outline"
          onPress={clearAllFilters}
          style={styles.clearSearchButton}
        />
      )}
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filters</Text>
        {selectedFilters.length > 0 && (
          <TouchableOpacity onPress={clearAllFilters} style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilters.includes(filter.id) && styles.filterChipActive
            ]}
            onPress={() => handleFilterToggle(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilters.includes(filter.id) && styles.filterChipTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort Events</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.sortOptionsList}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  selectedSort === option.id && styles.sortOptionActive
                ]}
                onPress={() => handleSortSelect(option.id)}
              >
                <View style={styles.sortOptionContent}>
                  {option.icon}
                  <Text style={[
                    styles.sortOptionText,
                    selectedSort === option.id && styles.sortOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </View>
                {selectedSort === option.id && (
                  <View style={styles.sortOptionCheck} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const isSearching = isDebouncing && searchQuery.length > 0;

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
            onSearch={handleSearch}
            showFilter={true}
            showSuggestions={true}
            recentSearches={recentSearches}
            popularSearches={popularSearches}
          />
          {(isSearching || (loading && !refreshing)) && (
            <Text style={styles.loadingText}>
              {isSearching ? "Searching..." : "Loading events..."}
            </Text>
          )}
        </View>

        {/* Controls Section */}
        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
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

            <View style={styles.rightControls}>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={handleSortPress}
                activeOpacity={0.7}
              >
                <Sliders size={20} color={Colors.text} />
                <Text style={styles.sortButtonText}>Sort</Text>
                <ChevronDown size={16} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilters.length > 0 && styles.filterButtonActive
                ]}
                onPress={handleFilterPress}
                activeOpacity={0.7}
              >
                <Filter size={20} color={selectedFilters.length > 0 ? Colors.white : Colors.text} />
                {selectedFilters.length > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{selectedFilters.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filters */}
        {showFilters && renderFilters()}

        {/* Events List */}
        <View style={styles.eventsSection}>
          <SectionHeader
            title={`${filteredAndSortedEvents.length} Events`}
            subtitle={
              searchQuery || selectedFilters.length > 0
                ? `Filtered results`
                : "Discover amazing events"
            }
            showSeeAll={false}
          />
          {loading && !refreshing ? (
            renderLoadingSkeletons()
          ) : (
            <FlatList
              data={filteredAndSortedEvents}
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
          )}
        </View>
      </View>

      {renderSortModal()}
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
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewModeToggle: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
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
  rightControls: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  filterButton: {
    position: "relative",
    padding: 8,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  filterRow: {
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.white,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  sortOptionsList: {
    padding: 20,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionActive: {
    backgroundColor: "rgba(230, 0, 126, 0.1)",
  },
  sortOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sortOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  sortOptionTextActive: {
    color: Colors.primary,
    fontWeight: "500",
  },
  sortOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
