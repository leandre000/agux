import SecureRoute from '@/components/SecureRoute';
import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { Clock, Home, Ticket, User, Utensils } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

function CustomTabBar({ state, descriptors, navigation }: any) {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;
                let icon;
                if (route.name === 'index') icon = <Home size={26} color={isFocused ? Colors.primary : Colors.textSecondary} />;
                else if (route.name === 'menu') icon = <Utensils size={26} color={isFocused ? Colors.primary : Colors.textSecondary} />;
                else if (route.name === 'tickets') icon = <Ticket size={26} color={isFocused ? Colors.primary : Colors.textSecondary} />;
                else if (route.name === 'events-user') icon = <Clock size={26} color={isFocused ? Colors.primary : Colors.textSecondary} />;
                else if (route.name === 'profile') icon = <User size={26} color={isFocused ? Colors.primary : Colors.textSecondary} />;
                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={() => navigation.navigate(route.name)}
                        style={styles.tabButton}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                            {icon}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function TabLayout() {
    return (
        <SecureRoute redirectTo="/auth/login">
            <Tabs
                tabBar={props => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen name="index" options={{ title: 'Home' }} />
                <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
                <Tabs.Screen name="tickets" options={{ title: 'Recent Events' }} />
                <Tabs.Screen name="events-user" options={{ title: 'Available/Booked Events' }} />
                <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
            </Tabs>
        </SecureRoute>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 40,
        marginHorizontal: 16,
        marginBottom: Platform.OS === 'ios' ? 24 : 16,
        marginTop: 8,
        paddingHorizontal: 0,
        paddingVertical: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrap: {
        padding: 8,
        borderRadius: 24,
        backgroundColor: 'transparent',
    },
    iconWrapActive: {
        backgroundColor: Colors.inputBackground,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 40,
    },
});
