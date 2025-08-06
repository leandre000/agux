import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Rect } from "react-native-svg";
import Header from "@/components/Header";
import { SeatsAPI } from "@/lib/api";

const seatSize = 28;
const seatGap = 10;

// dynamic layout is derived from backend available seats list
// We will construct a grid from seat numbers; if no coordinates, we lay out sequentially.

function SeatIcon({
  color,
  isSelected,
}: {
  color: string;
  isSelected?: boolean;
}) {
  return (
    <Svg width={seatSize} height={seatSize} viewBox="0 0 32 32">
      <Rect
        x="6"
        y="12"
        width="20"
        height="10"
        rx="4"
        fill={color}
        stroke={isSelected ? Colors.primary : "none"}
        strokeWidth={isSelected ? "2" : "0"}
      />
      <Rect
        x="8"
        y="22"
        width="16"
        height="6"
        rx="3"
        fill={color}
        stroke={isSelected ? Colors.primary : "none"}
        strokeWidth={isSelected ? "2" : "0"}
      />
      <Circle
        cx="10"
        cy="10"
        r="4"
        fill={color}
        stroke={isSelected ? Colors.primary : "none"}
        strokeWidth={isSelected ? "2" : "0"}
      />
      <Circle
        cx="22"
        cy="10"
        r="4"
        fill={color}
        stroke={isSelected ? Colors.primary : "none"}
        strokeWidth={isSelected ? "2" : "0"}
      />
    </Svg>
  );
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { id, categoryId, sectionId } = useLocalSearchParams<{
    id: string;
    categoryId?: string;
    sectionId?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  // we track a flat array of seat ids selected
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  async function loadSeats() {
    try {
      setError(null);
      setLoading(true);
      let data: any[] = [];
      if (categoryId) {
        data = (await SeatsAPI.getAvailableSeatsByCategory(
          categoryId
        )) as any[];
      } else if (sectionId) {
        data = (await SeatsAPI.getAvailableSeatsBySection(sectionId)) as any[];
      } else {
        throw new Error("Missing categoryId or sectionId for seats view");
      }
      setAvailableSeats(
        Array.isArray(data) ? data : (data as any)?.seats || []
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load seats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSeats();
    // release seats on unmount if reserved
    return () => {
      if (selectedSeatIds.length) {
        SeatsAPI.releaseSeats(selectedSeatIds).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const handleNext = async () => {
    if (!selectedSeatIds.length) {
      Alert.alert("Please select at least one seat");
      return;
    }
    // Try reserve seats before proceeding
    try {
      await SeatsAPI.reserveSeats(selectedSeatIds);
    } catch (e: any) {
      Alert.alert(
        "Reservation failed",
        e?.message ||
          "Could not reserve selected seats. They may no longer be available."
      );
      await loadSeats();
      return;
    }
    // Pass seatIds forward for purchase step
    router.push({
      pathname: `/event/${id}/ticket-names`,
      params: {
        count: String(selectedSeatIds.length),
        categoryId: categoryId || "",
        seatIds: selectedSeatIds.join(","),
      },
    });
  };

  // derive a simple grid from availableSeats length for presentation only
  const grid = useMemo(() => {
    const seats = availableSeats;
    const cols = 10;
    const rows = Math.ceil(seats.length / cols);
    const out: (any | null)[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: (any | null)[] = [];
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        row.push(seats[idx] ?? null);
      }
      out.push(row);
    }
    return out;
  }, [availableSeats]);

  const isSelected = (seatId: string) => selectedSeatIds.includes(seatId);

  const getSeatColor = (seat: any) => {
    if (!seat) return "#00000000";
    // available seats render default, selected render white
    if (isSelected(String(seat.seat_id || seat.id))) return "#fff";
    return Colors.primary;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header showLogo showProfile showSearch />
      {/* Back and Title */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          onPress={() => {
            console.log("Back pressed");
            router.back();
          }}
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.eventTitle}>Choose Seat</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.seatBox}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : error ? (
            <Text style={{ color: Colors.error }}>{error}</Text>
          ) : (
            <>
              {/* Seat grid */}
              <View style={styles.seatGrid}>
                {grid.map((row, rowIdx) => (
                  <View style={styles.seatRow} key={rowIdx}>
                    {row.map((seat, colIdx) =>
                      seat == null ? (
                        <View
                          key={colIdx}
                          style={{
                            width: seatSize + seatGap,
                            height: seatSize,
                          }}
                        />
                      ) : (
                        <TouchableOpacity
                          key={String(seat.seat_id || seat.id)}
                          style={[
                            styles.seat,
                            isSelected(String(seat.seat_id || seat.id)) &&
                              styles.seatSelected,
                          ]}
                          onPress={() =>
                            handleSeatToggle(String(seat.seat_id || seat.id))
                          }
                          activeOpacity={0.7}
                        >
                          <SeatIcon
                            color={getSeatColor(seat)}
                            isSelected={isSelected(
                              String(seat.seat_id || seat.id)
                            )}
                          />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                ))}
              </View>
              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendRow}>
                  <SeatIcon color="#fff" isSelected />
                  <Text style={styles.legendText}>
                    Your Selection ({selectedSeatIds.length})
                  </Text>
                </View>
                <View style={styles.legendRow}>
                  <SeatIcon color={Colors.primary} />
                  <Text style={styles.legendText}>Available</Text>
                </View>
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            selectedSeatIds.length === 0 && styles.nextBtnDisabled,
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={selectedSeatIds.length === 0}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoFirst: {
    color: Colors.text,
  },
  logoSecond: {
    color: Colors.primary,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    marginLeft: 8,
    borderWidth: 2,
    borderColor: Colors.card,
    backgroundColor: Colors.textSecondary,
  },
  profileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: Colors.textSecondary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  scrollContent: {
    paddingBottom: 32,
    alignItems: "center",
  },
  seatBox: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    marginBottom: 24,
    width: Dimensions.get("window").width - 32,
    alignItems: "center",
  },
  seatGrid: {
    marginBottom: 24,
  },
  seatRow: {
    flexDirection: "row",
    marginBottom: seatGap,
    justifyContent: "center",
  },
  seat: {
    width: seatSize,
    height: seatSize,
    borderRadius: 6,
    marginHorizontal: seatGap / 2,
    marginVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  seatSelected: {
    transform: [{ scale: 1.05 }],
  },
  legend: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
    borderWidth: 0,
  },
  legendText: {
    color: Colors.text,
    fontSize: 15,
    marginLeft: 8,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    width: Dimensions.get("window").width - 64,
    alignSelf: "center",
    marginTop: 8,
  },
  nextBtnDisabled: {
    opacity: 0.6,
  },
  nextBtnText: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 18,
  },
});
