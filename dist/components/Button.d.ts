import React, { PropsWithChildren } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
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
export default function Button({ children, containerStyle, gradientWrapperStyle, textStyle, isDisabled, isLoading, onPress, endIcon, startIcon, isOutlined, activityIndicatorColor, pendingActionBackgroundColor, gradientColors, useGradients, gradientStart, gradientEnd, }: PropsWithChildren<IButton>): React.JSX.Element;
