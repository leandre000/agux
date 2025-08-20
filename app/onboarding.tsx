import AuthGuard from '@/components/AuthGuard';
import { useAuthStore } from '@/store/auth-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

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
                
                {/* Dark pink gradient background matching the screenshot */}
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

                {/* Logo container */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>agura</Text>
                </View>

                {/* Loading indicator at bottom */}
                <View style={styles.loadingContainer}>
                    <View style={styles.progressDot} />
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
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        marginBottom: 8,
    },
    progressText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});