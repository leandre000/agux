import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Colors from '@/constants/Colors';

interface VerificationInputProps {
  length?: number;
  onCodeFilled: (code: string) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({ length = 5, onCodeFilled }) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

   
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if code is complete
    const filledCode = newCode.join('');
    if (filledCode.length === length) {
      onCodeFilled(filledCode);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectionColor={Colors.primary}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default VerificationInput;
