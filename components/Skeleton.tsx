import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle, type DimensionValue } from "react-native";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function Skeleton({ width = "100%", height = 16, radius = 8, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 250],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius: radius }, style]}> 
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            height: typeof height === "number" ? height : undefined,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 200,
    backgroundColor: "#F3F4F6",
    opacity: 0.7,
  },
});


