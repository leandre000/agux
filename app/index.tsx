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
            {/* Vibrant pink gradient background */}
            <LinearGradient
                colors={['#ff1493', '#e6007e', '#c2185b', '#ad1457', '#ff1493']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            
            {/* Darker purple oval shapes for depth */}
            <View style={styles.oval1} />
            <View style={styles.oval2} />
            
            {/* Logo container */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    <Text style={styles.stylizedA}>a</Text>
                    <Text style={styles.regularText}>gura</Text>
                </Text>
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
    oval1: {
        position: 'absolute',
        bottom: -height * 0.2,
        right: -width * 0.1,
        width: width * 0.8,
        height: height * 0.6,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(139, 0, 139, 0.3)',
        transform: [{ scaleX: 1.2 }],
    },
    oval2: {
        position: 'absolute',
        top: -height * 0.1,
        left: -width * 0.05,
        width: width * 0.6,
        height: height * 0.4,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(75, 0, 130, 0.2)',
        transform: [{ scaleX: 1.1 }],
    },
    logoContainer: {
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    stylizedA: {
        color: '#ffb6c1',
        fontSize: 42,
        fontWeight: '900',
    },
    regularText: {
        color: '#ffffff',
        fontSize: 48,
        fontWeight: 'bold',
    },
});