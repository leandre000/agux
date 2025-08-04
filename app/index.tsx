import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
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
            <Image
                source={require('@/assets/images/Splash-shadow.png')}
                style={styles.shadowImg}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <Image
                    source={require('@/assets/lex-logo.svg')}
                    style={styles.logoImg}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6007e', // solid magenta
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        width: '100%',
        height: '100%',
    },
    shadowImg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    logoImg: {
        width: 380,
        height: 380,
        alignSelf: 'center',
        zIndex: 3,
    },
});
