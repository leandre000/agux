import Colors from '@/constants/Colors';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type?: ToastType;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (message: string, opts?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>('info');
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setMessage(null));
  }, [opacity, translateY]);

  const showToast = useCallback((msg: string, opts?: ToastOptions) => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setType(opts?.type || 'info');
    setMessage(msg);
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();

    const duration = opts?.durationMs ?? 2500;
    hideTimer.current = setTimeout(() => hide(), duration);
  }, [hide, opacity, translateY]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const bg = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : Colors.card;
  const fg = type === 'info' ? Colors.text : '#ffffff';

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.container, { opacity, transform: [{ translateY }] }]}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={hide} style={[styles.toast, { backgroundColor: bg }]}> 
            <Text style={[styles.text, { color: fg }]}>{message}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});



