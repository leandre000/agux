import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AppEntry() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Navigate immediately without splash screen
        if (isAuthenticated) {
            router.replace('/(tabs)');
        } else {
            router.replace('./onboarding');
        }
    }, [isAuthenticated, router]);

    // Return null since we're navigating immediately
    return null;
}