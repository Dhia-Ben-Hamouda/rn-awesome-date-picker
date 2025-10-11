import React, {
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import {
  BackHandler,
  Dimensions,
  GestureResponderEvent,
  Modal as NativeModal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

interface IModal extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
  overlayStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Modal({
  isOpen,
  setIsOpen,
  containerStyle,
  overlayStyle,
  children,
}: IModal) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const closeModal = useCallback(() => {
    setIsOpen && setIsOpen(false);
  }, [setIsOpen]);

  const handleReverseAnimation = useCallback(() => {
    opacity.value = withTiming(0, {duration: 150});
    scale.value = withSequence(
      withTiming(1.1, {duration: 80}),
      withTiming(0, {duration: 120}, finished => {
        if (finished) {
          runOnJS(closeModal)();
        }
      }),
    );
  }, [scale, opacity, closeModal]);

  const handleOverlayPress = () => {
    handleReverseAnimation();
  };

  const handleAndroidBackdropPress = () => {
    if (Platform.OS === 'android') {
      handleReverseAnimation();
    }
  };

  const handleModalPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        handleReverseAnimation();
        return true;
      }
      return false;
    };

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }
  }, [isOpen, handleReverseAnimation]);

  useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, {duration: 300});
      scale.value = withSequence(
        withTiming(1.1, {duration: 300}),
        withSpring(1, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        }),
      );
    } else {
      opacity.value = withTiming(0, {duration: 250});
      scale.value = withTiming(0, {duration: 250});
    }
  }, [isOpen, scale, opacity]);

  return (
    <NativeModal
      transparent
      visible={isOpen}
      onRequestClose={handleReverseAnimation}>
      <Pressable onPress={handleAndroidBackdropPress}>
        <Animated.View
          style={[styles.overlay, overlayStyle, overlayAnimatedStyle]}>
          <Pressable
            onPress={handleOverlayPress}
            style={StyleSheet.absoluteFill}>
            <Animated.View style={StyleSheet.absoluteFill} />
          </Pressable>
          <Pressable onPress={handleModalPress}>
            <Animated.View
              style={[
                styles.container,
                containerStyle,
                containerAnimatedStyle,
              ]}>
              {children}
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
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
