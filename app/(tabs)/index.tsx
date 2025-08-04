import Carousel from '@/components/Carousel';
import EventCard from '@/components/EventCard';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Event, EventCategory } from '@/mocks/events';
import { useEventsStore } from '@/store/events-store';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for orders
const orders = [
    {
        id: '1',
        name: 'Soft Drinks',
        desc: 'Juice and Fries',
        price: '2,350Rwf',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=80&q=80',
        status: 'Delivered',
    },
    {
        id: '2',
        name: 'Soft Drinks',
        desc: 'Juice and Fries',
        price: '2,350Rwf',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=80&q=80',
        status: 'Delivered',
    },
];

// Mock data for available events (fallback)
const availableEventsMock: Event[] = [
    {
        id: 'a1',
        title: 'Summer Event',
        date: '10 May, 2025',
        location: 'Serena Hotel Kigali',
        image: require('../../assets/images/m1.png'),
        category: 'Music' as EventCategory,
        price: 'Standard',
        description: 'Join us for an unforgettable summer music festival featuring top artists from around the world.',
        isFeatured: false,
    },
];

// Mock data for booked events (fallback)
const bookedEventsMock: Event[] = [
    {
        id: 'b1',
        title: 'Baba Xpreince',
        date: '10 May, 2025',
        location: 'Serena Hotel Kigali',
        image: require('../../assets/images/m2.png'),
        category: 'Music' as EventCategory,
        price: 'VIP',
        description: 'Experience the legendary Baba Xpreince live in concert with special guest performances.',
        isFeatured: false,
    },
    {
        id: 'b2',
        title: 'Baba Xpreince',
        date: '10 May, 2025',
        location: 'Serena Hotel Kigali',
        image: require('../../assets/images/profile.jpg'),
        category: 'Music' as EventCategory,
        price: 'VIP',
        description: 'Experience the legendary Baba Xpreince live in concert with special guest performances.',
        isFeatured: false,
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const { featuredEvents, userEvents } = useEventsStore();

    // State for modal and order quantity
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
    const [orderQty, setOrderQty] = React.useState(1);
    const [orderTotal, setOrderTotal] = React.useState(0);

    const parsePrice = (priceStr) => {
        // Remove currency and commas, parse as float
        const num = parseFloat(priceStr.replace(/[^\d.]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    React.useEffect(() => {
        if (selectedOrder) {
            setOrderTotal(parsePrice(selectedOrder.price) * orderQty);
        }
    }, [selectedOrder, orderQty]);

    // For demo, split userEvents into available and booked
    let availableEvents = userEvents.slice(0, 1);
    if (availableEvents.length < 1) availableEvents = availableEventsMock;
    let bookedEvents = userEvents.slice(1, 3);
    if (bookedEvents.length < 2) bookedEvents = bookedEventsMock;

    const handleSeeAllUpcoming = () => {
        router.push('/events/upcoming');
    };

    const handleSeeAllAvailable = () => {

        router.push('/events/user');

    };

    const handleSeeAllBooked = () => {
        router.push('/events/user');
    };

    const handleSeeAllOrders = () => {
        // Route to orders page if exists
    };

    const ListEventCard = ({ event, isBooked }: { event: Event, isBooked?: boolean }) => (
        <View style={styles.listEventCard}>
            <Image source={typeof event.image === 'string' ? { uri: event.image } : event.image} style={styles.listEventImage} />
            <View style={styles.listEventInfo}>
                <View>
                    <Text style={styles.listEventTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={styles.listEventSubtitle}>Platini</Text>
                    <View style={styles.listEventMeta}>
                        <Calendar size={14} color={Colors.textSecondary} />
                        <Text style={styles.listEventMetaText}>{event.date}</Text>
                    </View>
                    <View style={styles.listEventMeta}>
                        <MapPin size={14} color={Colors.textSecondary} />
                        <Text style={styles.listEventMetaText}>{event.location}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.listDetailsButton} onPress={() => router.push({ pathname: `/event/${event.id}`, params: { booked: isBooked ? '1' : undefined } })}>
                    <ArrowUpRight size={16} color={Colors.text} />
                    <Text style={styles.listDetailsButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleOrderAgain = (order) => {
        setSelectedOrder(order);
        setOrderQty(order.qty);
        setModalVisible(true);
    };

    const handleIncrement = () => setOrderQty(qty => qty + 1);
    const handleDecrement = () => setOrderQty(qty => (qty > 1 ? qty - 1 : 1));
    const handleModalClose = () => setModalVisible(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header showLogo showProfile showSearch onSearchPress={() => router.push('/search')} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Upcoming Events */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <TouchableOpacity onPress={handleSeeAllUpcoming}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.carouselContainer}>
                    <Carousel>
                        {featuredEvents.map((event) => (
                            <TouchableOpacity key={event.id} onPress={() => router.push(`/event/${event.id}`)}>
                                <EventCard event={event} variant="featured" />
                            </TouchableOpacity>
                        ))}
                    </Carousel>
                </View>

                {/* Available Events */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Available Events</Text>
                    <TouchableOpacity onPress={handleSeeAllAvailable}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {availableEvents.map((event) => (
                    <ListEventCard key={`available-${event.id}`} event={event} />
                ))}

                {/* Booked Events */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Booked Events</Text>
                    <TouchableOpacity onPress={handleSeeAllBooked}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {bookedEvents.map((event) => (
                    <ListEventCard key={`booked-${event.id}`} event={event} isBooked />
                ))}

                {/* Orders */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Orders</Text>
                    <TouchableOpacity onPress={handleSeeAllOrders}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {orders.map((order) => {
                    const qty = order.id === selectedOrder?.id ? orderQty : order.qty;
                    const priceNum = parsePrice(order.price);
                    const totalPrice = (priceNum * qty).toFixed(2);
                    return (
                        <View key={order.id} style={styles.orderCard}>
                            {/* Complete Ribbon */}
                            <View style={styles.orderStatusRibbon}>
                                <Text style={styles.orderStatusText}>Complete</Text>
                            </View>
                            <Image source={typeof order.image === 'string' ? { uri: order.image } : order.image} style={styles.orderImage} />
                            <View style={styles.orderInfo}>
                                <Text style={styles.orderName}>{order.name}</Text>
                                <Text style={styles.orderDesc}>{order.desc}</Text>
                                <Text style={styles.orderPrice}>${totalPrice}</Text>
                            </View>
                            <View style={styles.orderQtyWrap}>
                                <Text style={styles.orderQty}>{qty}</Text>
                                <TouchableOpacity style={styles.orderAgainButton} onPress={() => handleOrderAgain(order)}>
                                    <Text style={[styles.orderAgainText, { textDecorationLine: 'underline', color: '#fff' }]}>Order again</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            {/* Modal for Order Again */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleModalClose}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: Colors.card, borderRadius: 20, padding: 24, width: 340, alignItems: 'center', position: 'relative' }}>
                        {/* Complete Ribbon */}
                        <View style={{ position: 'absolute', right: 0, top: 0, backgroundColor: Colors.success, borderTopRightRadius: 20, borderBottomLeftRadius: 20, paddingVertical: 2, paddingHorizontal: 16, zIndex: 2 }}>
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Complete</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <Image source={selectedOrder?.image ? (typeof selectedOrder.image === 'string' ? { uri: selectedOrder.image } : selectedOrder.image) : undefined} style={{ width: 64, height: 64, borderRadius: 12, marginRight: 16 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{selectedOrder?.name}</Text>
                                <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>{selectedOrder?.desc}</Text>
                            </View>
                        </View>
                        <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 22, marginVertical: 16 }}>${orderTotal.toFixed(2)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <TouchableOpacity onPress={handleDecrement} style={{ backgroundColor: Colors.primary, borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', minWidth: 32, textAlign: 'center' }}>{orderQty}</Text>
                            <TouchableOpacity onPress={handleIncrement} style={{ backgroundColor: Colors.primary, borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleModalClose} style={{ marginTop: 8 }}>
                            <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 0,
        paddingBottom: 32,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    carouselContainer: {
        marginBottom: 24,
        marginLeft:10,
    },
    eventCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 8,
    },
    detailsButton: {
        marginLeft: 12,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    detailsButtonText: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    listEventCard: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 12,
        height: 200,
    },
    listEventImage: {
        width: 200,
        height: '100%',
        borderRadius: 16,
        marginRight: 19,
    },
    listEventInfo: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    listEventTitle: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 17,
    },
    listEventSubtitle: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    listEventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    listEventMetaText: {
        color: Colors.textSecondary,
        fontSize: 13,
        marginLeft: 9,
    },
    listDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        paddingVertical: 7,
    },
    listDetailsButtonText: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 8,
    },
    orderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 12,
        position: 'relative',
    },
    orderImage: {
        width: 56,
        height: 56,
        borderRadius: 12,
        marginRight: 12,
    },
    orderInfo: {
        flex: 1,
    },
    orderName: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    orderDesc: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 2,
    },
    orderPrice: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    orderQtyWrap: {
        alignItems: 'center',
        marginHorizontal: 12,
    },
    orderQty: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    orderAgainButton: {
        backgroundColor: 'rgba(230,0,126,0.1)',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    orderAgainText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '500',
    },
    orderStatusRibbon: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: Colors.success,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        paddingVertical: 2,
        paddingHorizontal: 10,
    },
    orderStatusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
