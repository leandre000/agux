import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Rect } from 'react-native-svg';
import Header from '@/components/Header';

const numRows = 10;
const numCols = 10;
const seatSize = 28;
const seatGap = 10;

// Arrange seats with a central aisle and top gap as in the design
const seatLayout = [
    [null, null, 'u', 'u', 'u', 'u', 'u', 'u', null, null],
    [null, 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', null],
    ['u', 'u', 'u', 'x', 'x', 'u', 'u', 'u', 'u', 'u'],
    ['u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u'],
    ['u', 'u', 's', 'u', 'u', 'u', 'u', 's', 'u', 'u'],
    ['u', 'u', 'u', 'u', 'u', 's', 'u', 'u', 'u', 'u'],
    ['u', 'u', 'u', 's', 'u', 'u', 'u', 'u', 'u', 'u'],
    ['u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u'],
    ['u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u'],
    ['u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u'],
];
// 'u' = unselected, 's' = selected, 'x' = unavailable, null = no seat

function SeatIcon({ color, isSelected }: { color: string; isSelected?: boolean }) {
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
    const { id } = useLocalSearchParams<{ id: string }>();
    const [selected, setSelected] = useState<[number, number][]>([]);

    const handleSeatPress = (row: number, col: number) => {
        console.log('Seat pressed:', row, col);
        if (seatLayout[row][col] === 'x' || seatLayout[row][col] === null) {
            console.log('Seat is unavailable or null');
            return;
        }

        const idx = selected.findIndex(([r, c]) => r === row && c === col);
        let newSelected = [...selected];

        if (idx > -1) {
            console.log('Unselecting seat');
            newSelected.splice(idx, 1);
        } else {
            console.log('Selecting seat');
            newSelected.push([row, col]);
        }

        setSelected(newSelected);
        console.log('Updated selection:', newSelected);
    };

    const handleNext = () => {
        if (selected.length === 0) {
            Alert.alert('Please select at least one seat');
            return;
        }
        console.log('Next pressed with selected seats:', selected);
        // Navigate to ticket names page, passing the count
        router.push({ pathname: `/event/${id}/ticket-names`, params: { count: selected.length.toString() } });
    };

    const getSeatColor = (row: number, col: number) => {
        if (seatLayout[row][col] === 'x') return '#B0B0B0';
        if (selected.some(([r, c]) => r === row && c === col)) return '#fff';
        if (seatLayout[row][col] === 's') return '#4CAF50';
        return Colors.primary;
    };

    const isSelected = (row: number, col: number) => {
        return selected.some(([r, c]) => r === row && c === col);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header showLogo showProfile showSearch />
            {/* Back and Title */}
            <View style={styles.titleRow}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('Back pressed');
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
                    {/* Seat grid */}
                    <View style={styles.seatGrid}>
                        {seatLayout.map((row, rowIdx) => (
                            <View style={styles.seatRow} key={rowIdx}>
                                {row.map((seat, colIdx) =>
                                    seat === null ? (
                                        <View key={colIdx} style={{ width: seatSize + seatGap, height: seatSize }} />
                                    ) : (
                                        <TouchableOpacity
                                            key={colIdx}
                                            style={[
                                                styles.seat,
                                                isSelected(rowIdx, colIdx) && styles.seatSelected
                                            ]}
                                            onPress={() => handleSeatPress(rowIdx, colIdx)}
                                            disabled={seat === 'x'}
                                            activeOpacity={0.7}
                                        >
                                            <SeatIcon
                                                color={getSeatColor(rowIdx, colIdx)}
                                                isSelected={isSelected(rowIdx, colIdx)}
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
                            <SeatIcon color="#fff" isSelected={true} />
                            <Text style={styles.legendText}>Your Selection ({selected.length})</Text>
                        </View>
                        <View style={styles.legendRow}>
                            <SeatIcon color="#4CAF50" />
                            <Text style={styles.legendText}>Selected Seats</Text>
                        </View>
                        <View style={styles.legendRow}>
                            <SeatIcon color={Colors.primary} />
                            <Text style={styles.legendText}>UnSelected Seats</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.nextBtn, selected.length === 0 && styles.nextBtnDisabled]}
                    onPress={handleNext}
                    activeOpacity={0.8}
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
        marginBottom: 8,
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
    scrollContent: {
        paddingBottom: 32,
        alignItems: 'center',
    },
    seatBox: {
        backgroundColor: Colors.card,
        borderRadius: 18,
        padding: 18,
        marginTop: 8,
        marginBottom: 24,
        width: Dimensions.get('window').width - 32,
        alignItems: 'center',
    },
    seatGrid: {
        marginBottom: 24,
    },
    seatRow: {
        flexDirection: 'row',
        marginBottom: seatGap,
        justifyContent: 'center',
    },
    seat: {
        width: seatSize,
        height: seatSize,
        borderRadius: 6,
        marginHorizontal: seatGap / 2,
        marginVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    seatSelected: {
        transform: [{ scale: 1.05 }],
    },
    legend: {
        marginTop: 8,
        alignItems: 'flex-start',
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        width: Dimensions.get('window').width - 64,
        alignSelf: 'center',
        marginTop: 8,
    },
    nextBtnDisabled: {
        opacity: 0.6,
    },
    nextBtnText: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 18,
    },
});
