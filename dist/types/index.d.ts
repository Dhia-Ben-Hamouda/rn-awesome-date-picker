import { BottomSheetModalProps } from "@gorhom/bottom-sheet";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { IButton as ButtonProps } from "../components/Button";
export interface DatePickerBaseProps {
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    isRequired?: boolean;
    isError?: boolean;
    errorMessage?: string;
    errorMessageStyle?: StyleProp<TextStyle>;
    label?: string;
    placeholder?: string;
    isArrowShown?: boolean;
    placeholderStyle?: StyleProp<TextStyle>;
    arrowColor?: string;
    arrowSize?: number;
    arrowContainerStyle?: StyleProp<ViewStyle>;
    customArrowIcon?: React.ReactNode;
    onDatePickerOpened?: () => void;
    onDatePickerClosed?: () => void;
    customArrowRotation?: number;
    bottomSheetModalProps?: Partial<BottomSheetModalProps>;
    cancelButtonProps?: Omit<ButtonProps, "onPress">;
    chooseDateButtonProps?: Omit<ButtonProps, "onPress">;
    chooseYearButtonProps?: Omit<ButtonProps, "onPress">;
    chooseMonthButtonProps?: Omit<ButtonProps, "onPress">;
    cancelButtonText?: string;
    chooseDateButtonText?: string;
    chooseYearButtonText?: string;
    chooseMonthButtonText?: string;
    activeDateBackgroundColor?: string;
    activeDateTextColor?: string;
    dateBackgroundColor?: string;
    dateTextColor?: string;
    farDateTextColor?: string;
    farDateBackgroundColor?: string;
    rangeDateBackgroundColor?: string;
    disabledDateTextColor?: string;
    showInput?: boolean;
    showFarDates?: boolean;
    customHeader?: React.ReactNode;
    customFooter?: React.ReactNode;
    dateCellStyle?: StyleProp<ViewStyle>;
    currentSlideFormatter?: (date: Date) => string;
    customWeekDays?: string[];
    yearCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
    monthCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
    minDate?: Date;
    maxDate?: Date;
}
export type DateRangeValue = [Date | null, Date | null];
export interface SingleDatePickerProps extends DatePickerBaseProps {
    mode?: "single";
    value: Date | null;
    onChange?: (newDate: Date) => void;
}
export interface RanngeDatePickerProps extends DatePickerBaseProps {
    mode: "range";
    value: DateRangeValue;
    onChange?: (newDateRange: DateRangeValue) => void;
}
export interface DatePickerRef {
    open: () => void;
    close: () => void;
    handleChooseDate: () => void;
    swipeRight: () => void;
    swipeLeft: () => void;
    changeYear: () => void;
}
