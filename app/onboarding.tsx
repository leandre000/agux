import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import AuthGuard from '@/components/AuthGuard';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        // If already authenticated, skip onboarding
        if (isAuthenticated) {
            router.replace('/(tabs)');
            return;
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Navigate to welcome screen after loading completes
                    setTimeout(() => {
                        router.replace('/welcome');
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200); // Faster loading for better UX

        return () => clearInterval(interval);
    }, [router, isAuthenticated]);

    return (
        <AuthGuard requireGuest={true} redirectTo="/(tabs)">
            <View style={styles.container}>
                <StatusBar style="light" />
                
                {/* Pink/Magenta gradient background matching the screenshot */}
                <LinearGradient
                    colors={['#e91e63', '#c2185b', '#8e0038', '#ad1457']}
                    style={styles.background}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                
                {/* Curved shadow effect */}
                <View style={styles.shadowContainer}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent']}
                        style={styles.shadowGradient}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                </View>

                {/* Logo container */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>agura</Text>
                </View>

                {/* Loading indicator at bottom */}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#ffffff" style={styles.spinner} />
                    <Text style={styles.progressText}>{progress}%</Text>
                </View>
            </View>
        </AuthGuard>
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
        flex: 1,
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
    loadingContainer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
    },
    spinner: {
        marginBottom: 8,
    },
    progressText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});