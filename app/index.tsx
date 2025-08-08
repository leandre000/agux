import { useAuthStore } from '@/store/auth-store';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import React = require('react');

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [progress, setProgress] = useState(0);

    // Simulate progress loading
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    // Navigation after progress complete
    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                if (isAuthenticated) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('./onboarding');
                }
            }, 1000);
        }
    }, [progress, isAuthenticated, router]);

    return (
        <View style={styles.container}>
            {/* Deep magenta background gradient */}
            <LinearGradient
                colors={['#e6007e', '#d1006e', '#b8005a', '#a0004a']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            
            {/* Multiple blurred gradient circles for depth */}
            <View style={[styles.gradientContainer, styles.gradient1]}>
                <BlurView intensity={15} style={styles.blurCircle}>
                    <LinearGradient
                        colors={['#4a1d3a', '#6b2a4a', '#8a3a5a']}
                        style={styles.innerGradient}
                        start={{ x: 0.2, y: 0.2 }}
                        end={{ x: 0.8, y: 0.8 }}
                    />
                </BlurView>
            </View>

            <View style={[styles.gradientContainer, styles.gradient2]}>
                <BlurView intensity={25} style={styles.blurCircle}>
                    <LinearGradient
                        colors={['#3a1a2a', '#5a2a3a', '#7a3a4a']}
                        style={styles.innerGradient}
                        start={{ x: 0.3, y: 0.3 }}
                        end={{ x: 0.7, y: 0.7 }}
                    />
                </BlurView>
            </View>

            {/* Stylized "agura" text with enhanced effects */}
            <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                    <Text style={styles.logoText}>
                        <Text style={styles.logoChar}>a</Text>
                        <Text style={styles.logoChar}>g</Text>
                        <Text style={styles.logoChar}>u</Text>
                        <Text style={styles.logoChar}>r</Text>
                        <Text style={styles.logoChar}>a</Text>
                    </Text>
                    
                    {/* Highlight dot for first 'a' */}
                    <View style={styles.highlightDot} />
                    
                    {/* Break lines for letters */}
                    <View style={[styles.breakLine, styles.break1]} />
                    <View style={[styles.breakLine, styles.break2]} />
                    <View style={[styles.breakLine, styles.break3]} />
                    <View style={[styles.breakLine, styles.break4]} />
                </View>
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
    gradientContainer: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient1: {
        top: height * 0.1,
        left: width * 0.05,
    },
    gradient2: {
        top: height * 0.15,
        left: width * 0.1,
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width * 0.35,
    },
    blurCircle: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.45,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerGradient: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.45,
    },
    logoContainer: {
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 4,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    logoChar: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    highlightDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ffb3d9',
        top: -12,
        left: 12,
        zIndex: 11,
    },
    breakLine: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#ffb3d9',
        opacity: 0.8,
        borderRadius: 1,
    },
    break1: {
        width: 20,
        top: 15,
        left: 45,
        transform: [{ rotate: '15deg' }],
    },
    break2: {
        width: 16,
        top: 18,
        left: 85,
        transform: [{ rotate: '-10deg' }],
    },
    break3: {
        width: 18,
        top: 20,
        left: 125,
        transform: [{ rotate: '5deg' }],
    },
    break4: {
        width: 14,
        top: 22,
        left: 165,
        transform: [{ rotate: '-8deg' }],
    },
});
