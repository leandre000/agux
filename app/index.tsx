import { useAuthStore } from '@/store/auth-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
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
            {/* Pink/Magenta gradient background matching the screenshot */}
            <LinearGradient
                colors={['#e6007e', '#d81b60', '#c2185b', '#ad1457']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            
            {/* Curved shadow effect */}
            <View style={styles.shadowContainer}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent']}
                    style={styles.shadowGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>

            {/* Logo container */}
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
    shadowContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
        borderTopLeftRadius: width * 0.3,
        borderTopRightRadius: width * 0.3,
        overflow: 'hidden',
    },
    shadowGradient: {
        flex: 1,
        borderTopLeftRadius: width * 0.3,
        borderTopRightRadius: width * 0.3,
    },
    logoContainer: {
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});