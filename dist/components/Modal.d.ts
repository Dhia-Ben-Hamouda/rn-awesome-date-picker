import React, { PropsWithChildren, SetStateAction } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface IModal extends PropsWithChildren {
    isOpen: boolean;
    setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
    overlayStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}
export default function Modal({ isOpen, setIsOpen, containerStyle, overlayStyle, children, }: IModal): React.JSX.Element;
export {};
