import React, { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export interface IGradientCoordinate {
  x: number;
  y: number;
}

export interface IButton {
  containerStyle?: StyleProp<ViewStyle>;
  gradientWrapperStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isDisabled?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onPress?: () => void;
  isOutlined?: boolean;
  activityIndicatorColor?: string;
  pendingActionBackgroundColor?: string;
  useGradients?: boolean;
  gradientColors?: Array<string>;
  gradientStart?: IGradientCoordinate;
  gradientEnd?: IGradientCoordinate;
}

const DEFAULT_ACTIVITY_INDICATOR_COLOR = "#fff";
const DEFAULT_PENDING_ACTION_BACKGROUND_COLOR = "#888";

export default function Button({
  children,
  containerStyle,
  gradientWrapperStyle,
  textStyle,
  isDisabled,
  isLoading,
  onPress,
  endIcon,
  startIcon,
  isOutlined = false,
  activityIndicatorColor = DEFAULT_ACTIVITY_INDICATOR_COLOR,
  pendingActionBackgroundColor = DEFAULT_PENDING_ACTION_BACKGROUND_COLOR,
  gradientColors = ["#000", "#666"],
  useGradients = false,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
}: PropsWithChildren<IButton>) {
  const handlePress = () => {
    onPress && onPress();
  };

  if (useGradients) {
    return (
      <LinearGradient
        style={[{ borderRadius: 5 }, gradientWrapperStyle]}
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}>
        <TouchableOpacity
          style={[
            styles.gradientContainer,
            containerStyle,
            (isLoading || (isDisabled ?? false)) && {
              backgroundColor: pendingActionBackgroundColor,
            },
          ]}
          onPress={handlePress}
          disabled={isLoading || (isDisabled ?? false)}>
          {isLoading && <ActivityIndicator color={activityIndicatorColor} />}
          {startIcon}
          <Text
            style={[styles.label, isOutlined && { color: "#333" }, textStyle]}>
            {children}
          </Text>
          {endIcon}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading || (isDisabled ?? false)}
      style={[
        styles.container,
        containerStyle,
        (isLoading || (isDisabled ?? false)) && {
          backgroundColor: pendingActionBackgroundColor,
        },
        isOutlined && {
          backgroundColor: "transparent",
          borderWidth: 1,
        },
      ]}>
      {startIcon}
      {isLoading && <ActivityIndicator color={activityIndicatorColor} />}
      <Text style={[styles.label, isOutlined && { color: "#333" }, textStyle]}>
        {children}
      </Text>
      {endIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 5,
    gap: 8,
  },
  label: {
    color: "#fff",
  },
  gradientContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 5,
    gap: 8,
  },
});
