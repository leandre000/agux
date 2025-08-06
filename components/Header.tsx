import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, ChevronLeft, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showLogo?: boolean;
    showProfile?: boolean;
    showSearch?: boolean;
    onSearchPress?: () => void;
    onNotificationPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBack = false,
    showLogo = false,
    showProfile = false,
    showSearch = false,
    onSearchPress,
    onNotificationPress,
}) => {
    const router = useRouter();
    const { user } = useAuthStore();

    const profileImageSource = user?.profileImage
        ? { uri: user.profileImage }
        : require('@/assets/images/profile.jpg');

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={24} color={Colors.text} />
                    </TouchableOpacity>
                )}

                {showLogo && (
                    <Image
                        source={require('@/assets/images/splash-icon.png')}
                        style={styles.logoImage}
                    />
                )}

                {title && <Text style={styles.title}>{title}</Text>}
            </View>

            <View style={styles.rightContainer}>
                {showSearch && (
                    <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
                        <Search size={24} color={Colors.text} />
                    </TouchableOpacity>
                )}
                {/* Notification bell always visible with red dot */}
                <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
                    <View style={{ position: 'relative' }}>
                        <Bell size={24} color={Colors.text} />
                        <View style={styles.notificationDot} />
                    </View>
                </TouchableOpacity>
                {showProfile && (
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
                        <Image
                            source={profileImageSource}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
        height: 64,
        overflow: 'hidden',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    logoImage: {
        width: 160,
        height: 160,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginLeft: 8,
    },
    iconButton: {
        marginLeft: 16,
    },
    profileButton: {
        marginLeft: 16,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.card,
    },
    notificationDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: '#fff',
        zIndex: 1,
    },
});

export default Header;
