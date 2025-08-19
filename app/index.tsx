import { useAuthStore } from '@/store/auth-store';
import { LinearGradient } from 'expo-linear-gradient';
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
        }, 2000); // Show splash for 2 seconds

        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    return (
        <View style={styles.container}>
            {/* Dark pink gradient background */}
            <LinearGradient
                colors={['#8e0038', '#ad1457', '#c2185b', '#e91e63']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            
            {/* Soft pink circular gradient in center */}
            <View style={styles.centerGradient}>
                <LinearGradient
                    colors={['rgba(255, 192, 203, 0.3)', 'rgba(255, 182, 193, 0.1)']}
                    style={styles.softGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>

            {/* Logo */}
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
        position: 'relative',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    centerGradient: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        overflow: 'hidden',
    },
    softGradient: {
        flex: 1,
        borderRadius: width * 0.4,
    },
    logoContainer: {
        zIndex: 10,
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
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
});