"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Modal;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const SCREEN_WIDTH = react_native_1.Dimensions.get("screen").width;
const SCREEN_HEIGHT = react_native_1.Dimensions.get("screen").height;
function Modal({ isOpen, setIsOpen, containerStyle, overlayStyle, children, }) {
    const scale = (0, react_native_reanimated_1.useSharedValue)(0);
    const opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const containerAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    const overlayAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            opacity: opacity.value,
        };
    });
    const closeModal = (0, react_1.useCallback)(() => {
        setIsOpen && setIsOpen(false);
    }, [setIsOpen]);
    const handleReverseAnimation = (0, react_1.useCallback)(() => {
        opacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 150 });
        scale.value = (0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(1.1, { duration: 80 }), (0, react_native_reanimated_1.withTiming)(0, { duration: 120 }, finished => {
            if (finished) {
                (0, react_native_reanimated_1.runOnJS)(closeModal)();
            }
        }));
    }, [scale, opacity, closeModal]);
    const handleOverlayPress = () => {
        handleReverseAnimation();
    };
    const handleAndroidBackdropPress = () => {
        if (react_native_1.Platform.OS === 'android') {
            handleReverseAnimation();
        }
    };
    const handleModalPress = (e) => {
        e.stopPropagation();
    };
    (0, react_1.useEffect)(() => {
        const backAction = () => {
            if (isOpen) {
                handleReverseAnimation();
                return true;
            }
            return false;
        };
        if (react_native_1.Platform.OS === 'android') {
            const backHandler = react_native_1.BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }
    }, [isOpen, handleReverseAnimation]);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            opacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 300 });
            scale.value = (0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(1.1, { duration: 300 }), (0, react_native_reanimated_1.withSpring)(1, {
                damping: 20,
                stiffness: 200,
                mass: 0.5,
            }));
        }
        else {
            opacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 250 });
            scale.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 250 });
        }
    }, [isOpen, scale, opacity]);
    return (<react_native_1.Modal transparent visible={isOpen} onRequestClose={handleReverseAnimation}>
      <react_native_1.Pressable onPress={handleAndroidBackdropPress}>
        <react_native_reanimated_1.default.View style={[styles.overlay, overlayStyle, overlayAnimatedStyle]}>
          <react_native_1.Pressable onPress={handleOverlayPress} style={react_native_1.StyleSheet.absoluteFill}>
            <react_native_reanimated_1.default.View style={react_native_1.StyleSheet.absoluteFill}/>
          </react_native_1.Pressable>
          <react_native_1.Pressable onPress={handleModalPress}>
            <react_native_reanimated_1.default.View style={[
            styles.container,
            containerStyle,
            containerAnimatedStyle,
        ]}>
              {children}
            </react_native_reanimated_1.default.View>
          </react_native_1.Pressable>
        </react_native_reanimated_1.default.View>
      </react_native_1.Pressable>
    </react_native_1.Modal>);
}
const styles = react_native_1.StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0,0,0,.5)',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        minWidth: 300,
        minHeight: 200,
        borderRadius: 7,
    },
});
