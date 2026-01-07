import { router } from "expo-router";
import { useEffect } from "react";
import { Text, useColorScheme, View } from "react-native";
import Animated, {
    FadeInUp,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { Colors, Welcome as WelcomeConfig } from "../constants/theme";

/* Stable JS navigation function */
const navigateToTabs = () => {
  router.replace("/(tabs)");
};

export default function Welcome() {
  // Fix TypeScript issue by narrowing colorScheme type
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const progress = useSharedValue(0);
  const tickOpacity = useSharedValue(0);
  const tickScale = useSharedValue(0.5);

  useEffect(() => {
    // Animate progress bar
    progress.value = withTiming(
      1,
      { duration: WelcomeConfig.progressDuration },
      (finished) => {
        if (finished) {
          tickScale.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 150 })
          );

          tickOpacity.value = withTiming(1, { duration: 200 }, () => {
            "worklet";
            runOnJS(navigateToTabs)();
          });
        }
      }
    );
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const tickStyle = useAnimatedStyle(() => ({
    opacity: tickOpacity.value,
    transform: [{ scale: tickScale.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      {/* Static Logo */}
      <View style={{ marginBottom: 14 }}>
        <Text
          style={{
            color: theme.text,
            fontSize: 38,
            fontWeight: "900",
          }}
        >
          {WelcomeConfig.logoText}
        </Text>
      </View>

      {/* Subtitle */}
      <Animated.Text
        entering={FadeInUp.duration(700).delay(200)}
        style={{
          color: theme.text,
          fontSize: 16,
          marginBottom: 40,
        }}
      >
        {WelcomeConfig.subtitle}
      </Animated.Text>

      {/* Progress Bar */}
      <View
        style={{
          width: "100%",
          height: WelcomeConfig.progressBarHeight,
          backgroundColor: theme.progressTrack,
          borderRadius: 20,
        }}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: theme.progressBar,
              borderRadius: 20,
            },
            progressStyle,
          ]}
        >
          {/* Tick */}
          <Animated.View
            style={[
              {
                position: "absolute",
                right: -12,
                top: -14,
                width: WelcomeConfig.tickSize,
                height: WelcomeConfig.tickSize,
                backgroundColor: theme.tick,
                borderRadius: WelcomeConfig.tickSize / 2,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#fff",
                opacity: 0,
              },
              tickStyle,
            ]}
          >
            <View
              style={{
                width: 8,
                height: 12,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderColor: "#fff",
                transform: [{ rotate: "45deg" }],
              }}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}
