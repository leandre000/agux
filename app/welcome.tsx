import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import Images from '@/constants/images';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleSignUp = () => {
        router.push('/auth/register');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.innerContent}>
                <View style={styles.carouselContainer}>
                    <Carousel>
                        <Image
                            source={{ uri: Images.concertImage1 }}
                            style={styles.image}
                            contentFit="cover"
                        />
                        <Image
                            source={{ uri: Images.concertImage2 }}
                            style={styles.image}
                            contentFit="cover"
                        />
                    </Carousel>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>
                        Enjoy Endless Events{"\n"}Experiences with <Text style={styles.highlight}>Agura</Text>
                    </Text>
                    <Text style={styles.description}>
                        Agura ticketing platform is here for your events — grab your tickets and have fun, all in one place.
                    </Text>
                    <View style={styles.buttonRow}>
                        <Button
                            title="Login"
                            variant="primary"
                            style={styles.loginButton}
                            textStyle={styles.buttonText}
                            onPress={handleLogin}
                        />
                        <Button
                            title="Sign Up"
                            variant="outline"
                            style={styles.signUpButton}
                            textStyle={styles.buttonText}
                            onPress={handleSignUp}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const SPACING = 32;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContent: {
        flex: 1,
        width: '100%',
        paddingHorizontal: SPACING,
        paddingTop: SPACING,
        zIndex: 2,
        justifyContent: 'center',
    },
    carouselContainer: {
        height: height * 0.36,
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: SPACING,
        backgroundColor: 'transparent',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 34,
        marginBottom: SPACING / 1.5,
    },
    highlight: {
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: '#e6007e',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    description: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING,
        opacity: 0.9,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 8,
    },
    loginButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 10,
        paddingHorizontal: 0,
        minWidth: 100,
        maxWidth: 140,
        borderRadius: 30,
    },
    signUpButton: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 10,
        paddingHorizontal: 0,
        minWidth: 100,
        maxWidth: 140,
        borderRadius: 30,
        borderWidth: 1.5,
        backgroundColor: '#fff',
        color: '#e6007e',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
