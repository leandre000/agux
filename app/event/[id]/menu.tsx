import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { key: 'pizza', label: 'Pizza', icon: 'pizza' },
    { key: 'burger', label: 'Burger', icon: 'hamburger' },
    { key: 'drinks', label: 'Drinks', icon: 'cup' },
    { key: 'dessert', label: 'Dessert', icon: 'ice-cream' },
];

const FOODS = Array(8).fill(0).map((_, i) => ({
    id: i + 1,
    name: 'Big cheese burger',
    desc: 'This is a big burger cheese for people',
    image: require('@/assets/images/m1.png'),
    rating: 4,
    favorite: false,
}));

export default function EventMenuScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('burger');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header showLogo showProfile showSearch />
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ChevronLeft size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>Event Menu</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryScrollContent}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[styles.categoryBtn, selectedCategory === cat.key && styles.categoryBtnSelected]}
                            onPress={() => setSelectedCategory(cat.key)}
                            activeOpacity={0.85}
                        >
                            <View style={styles.categoryIconWrap}>
                                <MaterialCommunityIcons name={cat.icon} size={10} color={selectedCategory === cat.key ? Colors.primary : Colors.text} />
                            </View>
                            <Text style={[styles.categoryLabel, selectedCategory === cat.key && styles.categoryLabelSelected]}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.foodHeaderRow}>
                    <Text style={styles.foodHeader}>Available Foods</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View all(29)</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={FOODS}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.foodList}
                    renderItem={({ item }) => (
                        <View style={styles.foodCard}>
                            <Image source={item.image} style={styles.foodImage} />
                            <Text style={styles.foodName}>{item.name}</Text>
                            <Text style={styles.foodDesc}>{item.desc}</Text>
                            <View style={styles.foodMetaRow}>
                                <View style={styles.foodRatingRow}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.foodRatingText}>{item.rating}+</Text>
                                </View>
                                <TouchableOpacity>
                                    <Feather name={item.favorite ? 'heart' : 'heart'} size={18} color={item.favorite ? Colors.primary : Colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const CARD_WIDTH = (width - 48) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingBottom: 0,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 18,
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
    },
    categoryScroll: {
        marginBottom: 18,
        paddingLeft: 8,
    },
    categoryScrollContent: {
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between',
    },
    categoryBtn: {
        alignItems: 'center',
        marginRight: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 40,
        fontSize: 4,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryBtnSelected: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(230,0,126,0.08)',
    },
    categoryIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    categoryLabel: {
        color: Colors.text,
        fontSize: 7,
        fontWeight: '500',
    },
    categoryLabelSelected: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    foodHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    foodHeader: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    viewAll: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    foodList: {
        paddingHorizontal: 8,
        paddingBottom: 24,
    },
    foodCard: {
        backgroundColor: Colors.card,
        borderRadius: 18,
        padding: 14,
        margin: 8,
        width: CARD_WIDTH,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
    },
    foodImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginBottom: 10,
    },
    foodName: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 2,
        textAlign: 'center',
    },
    foodDesc: {
        color: Colors.text,
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    foodMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 4,
    },
    foodRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    foodRatingText: {
        color: Colors.text,
        fontSize: 13,
        marginLeft: 4,
    },
});
