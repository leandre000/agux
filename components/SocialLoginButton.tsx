import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  View,
} from 'react-native';
import Colors from '../constants/Colors';

type SocialProvider = 'apple' | 'google' | 'gmail' | 'phone';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  style?: ViewStyle;
  showText?: boolean;
}

const iconMap: Record<SocialProvider, any> = {
  apple: require('../assets/icons/apple.png'),
  google: require('../assets/icons/google.png'),
  gmail: require('../assets/icons/gmail.png'),
  phone: require('../assets/icons/phone.png'),
};

const textMap: Record<SocialProvider, string> = {
  apple: 'Register with Apple',
  google: 'Register with Google',
  gmail: 'Register with Gmail',
  phone: 'Register with Phone',
};

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  style,
  showText = true,
}) => {
  const iconSource = iconMap[provider];
  const buttonText = textMap[provider];

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrapper}>
        <Image source={iconSource} style={styles.icon} resizeMode="cover" />
      </View>
      {showText && <Text style={styles.text}>{buttonText}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  text: {
  fontWeight: '500',
  marginLeft: 12,
  fontSize: 16,
  color: '#000', 
},

});

export default SocialLoginButton;
