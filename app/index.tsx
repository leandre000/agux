import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                router.replace('/(tabs)');
            } else {
                router.replace('./onboarding');
            }
        }, 1500); // Reduced to 1.5 seconds for faster loading

        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>agura</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary, // Solid pink background
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 56,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 3,
        textTransform: 'lowercase',
        fontFamily: 'System',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
});