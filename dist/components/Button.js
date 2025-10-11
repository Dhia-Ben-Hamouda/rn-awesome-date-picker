"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const DEFAULT_ACTIVITY_INDICATOR_COLOR = "#fff";
const DEFAULT_PENDING_ACTION_BACKGROUND_COLOR = "#888";
function Button({ children, containerStyle, gradientWrapperStyle, textStyle, isDisabled, isLoading, onPress, endIcon, startIcon, isOutlined = false, activityIndicatorColor = DEFAULT_ACTIVITY_INDICATOR_COLOR, pendingActionBackgroundColor = DEFAULT_PENDING_ACTION_BACKGROUND_COLOR, gradientColors = ["#000", "#666"], useGradients = false, gradientStart = { x: 0, y: 0 }, gradientEnd = { x: 1, y: 0 }, }) {
    const handlePress = () => {
        onPress && onPress();
    };
    if (useGradients) {
        return (<react_native_linear_gradient_1.default style={[{ borderRadius: 5 }, gradientWrapperStyle]} colors={gradientColors} start={gradientStart} end={gradientEnd}>
        <react_native_1.TouchableOpacity style={[
                styles.gradientContainer,
                containerStyle,
                (isLoading || (isDisabled !== null && isDisabled !== void 0 ? isDisabled : false)) && {
                    backgroundColor: pendingActionBackgroundColor,
                },
            ]} onPress={handlePress} disabled={isLoading || (isDisabled !== null && isDisabled !== void 0 ? isDisabled : false)}>
          {isLoading && <react_native_1.ActivityIndicator color={activityIndicatorColor}/>}
          {startIcon}
          <react_native_1.Text style={[styles.label, isOutlined && { color: "#333" }, textStyle]}>
            {children}
          </react_native_1.Text>
          {endIcon}
        </react_native_1.TouchableOpacity>
      </react_native_linear_gradient_1.default>);
    }
    return (<react_native_1.TouchableOpacity onPress={handlePress} disabled={isLoading || (isDisabled !== null && isDisabled !== void 0 ? isDisabled : false)} style={[
            styles.container,
            containerStyle,
            (isLoading || (isDisabled !== null && isDisabled !== void 0 ? isDisabled : false)) && {
                backgroundColor: pendingActionBackgroundColor,
            },
            isOutlined && {
                backgroundColor: "transparent",
                borderWidth: 1,
            },
        ]}>
      {startIcon}
      {isLoading && <react_native_1.ActivityIndicator color={activityIndicatorColor}/>}
      <react_native_1.Text style={[styles.label, isOutlined && { color: "#333" }, textStyle]}>
        {children}
      </react_native_1.Text>
      {endIcon}
    </react_native_1.TouchableOpacity>);
}
const styles = react_native_1.StyleSheet.create({
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
