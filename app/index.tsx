import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import React = require('react');

export default function IndexScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    // Direct navigation without splash screen
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        } else {
            router.replace('./onboarding');
        }
    }, [isAuthenticated, router]);

    return <View />;
}