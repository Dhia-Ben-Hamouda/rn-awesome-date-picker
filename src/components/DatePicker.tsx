import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import moment from "moment";
import React, {
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import Button, { IButton as ButtonProps } from "./Button";
import Modal from "./Modal";

const ANIMATION_DURATION = 500;

const DEFAULT_ARROW_COLOR = "rgba(0,0,0,.75)";
const DEFAULT_ARROW_SIZE = 12;
const DEFAULT_ARROW_ROTATION = 0;

const DEFAULT_ACTIVE_DATE_TEXT_COLOR = "#fff";
const DEFAULT_ACTIVE_DATE_BACKGROUND_COLOR = "#333";

const DEFAULT_DATE_TEXT_COLOR = "#333";
const DEFAULT_DATE_BACKGROUND_COLOR = "transparent";

const DEFAULT_FAR_DATE_TEXT_COLOR = "rgba(0,0,0,0.25)";
const DEFAULT_FAR_DATE_BACKGROUND_COLOR = "transparent";

const DEFAULT_RANGE_DATE_TEXT_COLOR = "#333";
const DEFAULT_RANGE_DATE_BACKGROUND_COLOR = "rgba(0, 0, 0, 0.075)";

const DEFAULT_DISABLED_DATE_TEXT_COLOR = "rgba(0,0,0,0.25)";

const NUMBER_OF_DATE_CELLS_PER_SLIDE = 35;
const YEAR_COLUMN_GAP = 4;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const isIos = Platform.OS === 'ios';

type DateMode = "single" | "range";
type DateValue = Date | null;
export type DateRangeValue = [Date | null, Date | null];

function AngleDown({
  size = 20,
  color = DEFAULT_ARROW_COLOR,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 448 512">
      <Path
        fill={color}
        d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
      />
    </Svg>
  );
}

function generateCalendarData(date: Date): ICalendarItem[] {
  const m = moment(date);

  const orderedWeekdays = [
    moment.weekdaysShort()[1],
    moment.weekdaysShort()[2],
    moment.weekdaysShort()[3],
    moment.weekdaysShort()[4],
    moment.weekdaysShort()[5],
    moment.weekdaysShort()[6],
    moment.weekdaysShort()[0],
  ].map(day => ({
    type: "weekday" as const,
    label: day,
  }));

  const startOfMonth = m.clone().startOf("month");
  const numberOfdaysInCurrentMonth = m.daysInMonth();
  const startWeekday = (startOfMonth.day() + 6) % 7;

  const previousMonth = m.clone().subtract(1, "month");
  const numberOfDaysInPreviousMonth = previousMonth.daysInMonth();

  const previousDays = Array.from({ length: startWeekday }).map((_, index) => {
    const day = previousMonth
      .clone()
      .date(numberOfDaysInPreviousMonth - startWeekday + index + 1)
      .toDate();
    return { type: "prev" as const, label: day };
  });

  const currentDays = Array.from({ length: numberOfdaysInCurrentMonth }).map(
    (_, index) => {
      const day = startOfMonth
        .clone()
        .date(index + 1)
        .toDate();
      return { type: "current" as const, label: day };
    },
  );

  const totalDaysSoFar = previousDays?.length + currentDays?.length;

  const totalWeeks = Math.ceil(totalDaysSoFar / 7);
  const totalCells = totalWeeks > 5 ? 42 : NUMBER_OF_DATE_CELLS_PER_SLIDE;

  const remainingDaysToFill = totalCells - totalDaysSoFar;
  const nextMonth = m.clone().add(1, "month");

  const nextDays = Array.from({ length: remainingDaysToFill }).map(
    (_, index) => {
      const day = nextMonth
        .clone()
        .date(index + 1)
        .toDate();
      return { type: "next" as const, label: day };
    },
  );

  return [...orderedWeekdays, ...previousDays, ...currentDays, ...nextDays];
}

interface IMonthCell {
  month: number;
  index: number;
  monthContainerWidth: number;
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<SetStateAction<number>>;
  activeMonthBackgroundColor: string;
  activeMonthTextColor: string;
}

function MonthCell({
  month,
  index,
  monthContainerWidth,
  selectedMonth,
  setSelectedMonth,
  activeMonthBackgroundColor,
  activeMonthTextColor,
}: IMonthCell) {
  const isActiveCell = useSharedValue(0);

  useEffect(() => {
    isActiveCell.value = withTiming(month === selectedMonth ? 1 : 0);
  }, [month, selectedMonth]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isActiveCell.value,
      [0, 1],
      ["transparent", activeMonthBackgroundColor],
    );

    return {
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isActiveCell.value,
      [0, 1],
      ["#333", activeMonthTextColor],
    );

    return {
      color,
    };
  });

  if (!monthContainerWidth) return null;

  return (
    <AnimatedPressable
      onPress={() => {
        setSelectedMonth(month);
      }}
      style={[
        styles.yearCell,
        {
          width: (monthContainerWidth - YEAR_COLUMN_GAP * 2) / 3,
          marginEnd: (index + 1) % 3 === 0 ? 0 : YEAR_COLUMN_GAP,
        },
        animatedContainerStyle,
      ]}>
      <Animated.Text style={[styles.yearText, animatedTextStyle]}>
        {moment().month(month).format("MMM")}
      </Animated.Text>
    </AnimatedPressable>
  );
}

interface IYearCell {
  year: string;
  index: number;
  yearContainerWidth: number;
  selectedYear: number;
  setSelectedYear: React.Dispatch<SetStateAction<number>>;
  activeYearBackgroundColor: string;
  activeYearTextColor: string;
}

function YearCell({
  year,
  index,
  yearContainerWidth,
  selectedYear,
  setSelectedYear,
  activeYearBackgroundColor,
  activeYearTextColor,
}: IYearCell) {
  const isActiveCell = useSharedValue(0);

  useEffect(() => {
    isActiveCell.value = withTiming(year === selectedYear?.toString() ? 1 : 0);
  }, [year, selectedYear]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isActiveCell.value,
      [0, 1],
      ["transparent", activeYearBackgroundColor],
    );

    return {
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isActiveCell.value,
      [0, 1],
      ["#333", activeYearTextColor],
    );

    return {
      color,
    };
  });

  if (!yearContainerWidth) return null;

  return (
    <AnimatedPressable
      onPress={() => {
        setSelectedYear(parseInt(year));
      }}
      style={[
        styles.yearCell,
        {
          width: (yearContainerWidth - YEAR_COLUMN_GAP * 2) / 3,
          marginEnd: (index + 1) % 3 === 0 ? 0 : YEAR_COLUMN_GAP,
        },
        animatedContainerStyle,
      ]}>
      <Animated.Text style={[styles.yearText, animatedTextStyle]}>
        {year}
      </Animated.Text>
    </AnimatedPressable>
  );
}

type CellType = "prev" | "current" | "next";

interface IDateCell {
  cellType: CellType;
  isLastInRow: boolean;
  label: Date;
  mode: DateMode;
  localDate: DateValue | DateRangeValue;
  setLocalDate: React.Dispatch<SetStateAction<DateValue | DateRangeValue>>;
  currentSlide: Date;
  setCurrentSlide: React.Dispatch<SetStateAction<Date>>;
  activeDateBackgroundColor: string;
  activeDateTextColor: string;
  dateTextColor: string;
  dateBackgroundColor: string;
  farDateTextColor: string;
  farDateBackgroundColor: string;
  rangeDateTextColor: string;
  rangeDateBackgroundColor: string;
  disabledDateTextColor: string;
  showFarDates: boolean;
  dateCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
  startDateCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
  endDateCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
  minDate?: Date;
  maxDate?: Date;
}

function DateCell({
  isLastInRow,
  label,
  cellType,
  mode,
  localDate,
  setLocalDate,
  currentSlide,
  setCurrentSlide,
  activeDateBackgroundColor,
  activeDateTextColor,
  dateTextColor,
  dateBackgroundColor,
  farDateTextColor,
  farDateBackgroundColor,
  rangeDateTextColor,
  rangeDateBackgroundColor,
  disabledDateTextColor,
  showFarDates,
  dateCellStyle,
  startDateCellStyle,
  endDateCellStyle,
  minDate,
  maxDate,
}: IDateCell) {
  const isActive = useSharedValue(0);
  const isInRange = useSharedValue(0);

  const isDateNotInBounds =
    (minDate && moment(label).isBefore(minDate)) ||
    (maxDate && moment(label).isAfter(maxDate));

  useEffect(() => {
    if (cellType !== "current") {
      isActive.value = 0;
      isInRange.value = 0;
      return;
    }

    if (mode === "single") {
      const isSame = moment(localDate as DateValue).isSame(label, "day");
      isActive.value = withSpring(isSame ? 1 : 0);
      isInRange.value = 0;
    } else {
      const [start, end] = localDate as DateRangeValue;
      const isStart = start && moment(start).isSame(label, "day");
      const isEnd = end && moment(end).isSame(label, "day");
      const inRange =
        start && end && moment(label).isBetween(start, end, "day", "()");

      isActive.value = withSpring(isStart || isEnd ? 1 : 0);
      isInRange.value = withTiming(inRange ? 1 : 0);
    }
  }, [localDate, label, mode, cellType]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    let baseBackgroundColor = farDateBackgroundColor;

    if (cellType === "current") {
      baseBackgroundColor = dateBackgroundColor;

      if (mode === "range" && isInRange.value > 0) {
        baseBackgroundColor = interpolateColor(
          isInRange.value,
          [0, 1],
          [dateBackgroundColor, rangeDateBackgroundColor],
        );
      }

      if (isActive.value > 0) {
        baseBackgroundColor = interpolateColor(
          isActive.value,
          [0, 1],
          [baseBackgroundColor, activeDateBackgroundColor],
        );
      }
    }

    return {
      backgroundColor: baseBackgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    let baseColor = farDateTextColor;

    if (cellType === "current") {
      baseColor = dateTextColor;

      if (mode === "range" && isInRange.value > 0) {
        baseColor = interpolateColor(
          isInRange.value,
          [0, 1],
          [dateTextColor, rangeDateTextColor],
        );
      }

      if (isActive.value > 0) {
        baseColor = interpolateColor(
          isActive.value,
          [0, 1],
          [baseColor, activeDateTextColor],
        );
      }
    }

    return {
      color: isDateNotInBounds ? disabledDateTextColor : baseColor,
      fontWeight: "500",
    };
  });

  const handlePress = () => {
    if (cellType === "prev") {
      setCurrentSlide(moment(currentSlide).subtract(1, "month").toDate());
    } else if (cellType === "next") {
      setCurrentSlide(moment(currentSlide).add(1, "month").toDate());
    } else {
      if (mode === "single") {
        setLocalDate(label);
      } else {
        const [start, end] = localDate as DateRangeValue;

        if (!start || (start && end)) {
          setLocalDate([label, null]);
        } else {
          const newEnd = moment(label).isBefore(start) ? start : label;
          const newStart = moment(label).isBefore(start) ? label : start;
          setLocalDate([newStart, newEnd]);
        }
      }
    }
  };

  const isStartDateCell = useMemo(() => {
    return (
      cellType === "current" &&
      mode === "range" &&
      localDate &&
      moment((localDate as DateRangeValue)[0])?.isSame(label)
    );
  }, [cellType, localDate, label]);

  const isEndDateCell = useMemo(() => {
    return (
      cellType === "current" &&
      mode === "range" &&
      localDate &&
      moment((localDate as DateRangeValue)[1])?.isSame(label)
    );
  }, [cellType, localDate, label]);

  return (
    <AnimatedPressable
      disabled={isDateNotInBounds || (!showFarDates && cellType !== "current")}
      onPress={handlePress}
      style={[
        styles.cell,
        !isLastInRow && { marginRight: 4 },
        !showFarDates && cellType !== "current" && { opacity: 0 },
        dateCellStyle,
        isStartDateCell && startDateCellStyle,
        isEndDateCell && endDateCellStyle,
        animatedContainerStyle,
      ]}>
      <Animated.Text style={[animatedTextStyle]}>
        {moment(label).format("D")}
      </Animated.Text>
    </AnimatedPressable>
  );
}

type ICalendarItem =
  | {
      type: CellType;
      label: Date;
    }
  | {
      type: "weekday";
      label: string;
    };

export interface IDatePickerRef {
  open: () => void;
  close: () => void;
  handleChooseDate: () => void;
  swipeRight: () => void;
  swipeLeft: () => void;
  changeYear: () => void;
}

interface IDatePickerBase {
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
  dateTextColor?: string;
  dateBackgroundColor?: string;
  farDateTextColor?: string;
  farDateBackgroundColor?: string;
  rangeDateTextColor?: string;
  rangeDateBackgroundColor?: string;
  disabledDateTextColor?: string;
  showInput?: boolean;
  showFarDates?: boolean;
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
  dateCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
  startDateCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
  endDateCellStyle?: StyleProp<Omit<ViewStyle, "backgroundColor" | "color">>;
  minDate?: Date;
  maxDate?: Date;
}

interface IDatePickerSingle extends IDatePickerBase {
  mode?: "single";
  value: DateValue;
  onChange?: (newDate: Date) => void;
}

interface IDatePickerRange extends IDatePickerBase {
  mode: "range";
  value: DateRangeValue;
  onChange?: (newDateRange: DateRangeValue) => void;
}

type IDatePicker = IDatePickerSingle | IDatePickerRange;

function DatePicker(
  {
    containerStyle,
    inputContainerStyle,
    labelStyle,
    isRequired = false,
    isError,
    errorMessage,
    errorMessageStyle,
    label,
    placeholder = "Select date",
    onChange,
    value,
    mode = "single",
    isArrowShown = true,
    arrowColor = DEFAULT_ARROW_COLOR,
    arrowSize = DEFAULT_ARROW_SIZE,
    placeholderStyle,
    arrowContainerStyle,
    customArrowIcon,
    onDatePickerOpened,
    onDatePickerClosed,
    customArrowRotation = DEFAULT_ARROW_ROTATION,
    bottomSheetModalProps,
    cancelButtonProps,
    chooseDateButtonProps,
    chooseYearButtonProps,
    chooseMonthButtonProps,
    chooseYearButtonText = "Choose year",
    chooseMonthButtonText = "Choose month",
    cancelButtonText = "Cancel",
    chooseDateButtonText = "Choose date",
    activeDateTextColor = DEFAULT_ACTIVE_DATE_TEXT_COLOR,
    activeDateBackgroundColor = DEFAULT_ACTIVE_DATE_BACKGROUND_COLOR,
    dateTextColor = DEFAULT_DATE_TEXT_COLOR,
    dateBackgroundColor = DEFAULT_DATE_BACKGROUND_COLOR,
    farDateTextColor = DEFAULT_FAR_DATE_TEXT_COLOR,
    farDateBackgroundColor = DEFAULT_FAR_DATE_BACKGROUND_COLOR,
    rangeDateTextColor = DEFAULT_RANGE_DATE_TEXT_COLOR,
    rangeDateBackgroundColor = DEFAULT_RANGE_DATE_BACKGROUND_COLOR,
    disabledDateTextColor = DEFAULT_DISABLED_DATE_TEXT_COLOR,
    customHeader,
    customFooter,
    showInput = true,
    showFarDates = true,
    dateCellStyle,
    startDateCellStyle,
    endDateCellStyle,
    minDate,
    maxDate,
  }: IDatePicker,
  ref: React.Ref<IDatePickerRef>,
) {
  const isOpen = useSharedValue(0);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [localDate, setLocalDate] = useState<DateValue | DateRangeValue>(value);

  const getInitialSlide = () => {
    if (mode === "single") {
      return (value as DateValue) ?? new Date();
    }
    return (value as DateRangeValue)?.[0] ?? new Date();
  };

  const [currentSlide, setCurrentSlide] = useState<Date>(getInitialSlide());
  const [isYearsModalOpen, setIsYearsModalOpen] = useState(false);
  const [isMonthsModalOpen, setIsMonthsModalOpen] = useState(false);
  const [currentDecade, setCurrentDecade] = useState<Date>(getInitialSlide());
  const [yearContainerWidth, setYearContainerWidth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentSlide?.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentSlide?.getMonth());

  useEffect(() => {
    setCurrentDecade(currentSlide);
  }, [currentSlide]);

  const leftArrowScale = useSharedValue(1);
  const rightArrowScale = useSharedValue(1);

  const animatedLeftArrowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leftArrowScale.value }, { rotate: "90deg" }],
  }));

  const animatedRightArrowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rightArrowScale.value }, { rotate: "-90deg" }],
  }));

  const handleMonthChange = (direction: "prev" | "next") => {
    const isPrev = direction === "prev";
    setCurrentSlide(prev =>
      moment(prev)
        .add(isPrev ? -1 : 1, "month")
        .toDate(),
    );
  };

  useEffect(() => {
    if (value) {
      setLocalDate(value);
      if (mode === "single") {
        setCurrentSlide(value as Date);
      } else {
        const rangeValue = value as DateRangeValue;
        if (rangeValue[0]) setCurrentSlide(rangeValue[0]);
      }
    }
  }, [value, mode]);

  const bottomSheetModalBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const animatedArrowStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      isOpen.value,
      [0, 1],
      [0, customArrowRotation],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const resetToInitialState = () => {
    setLocalDate(value);
    if (mode === "single") {
      setCurrentSlide((value as DateValue) ?? new Date());
    } else {
      const rangeValue = value as DateRangeValue;
      setCurrentSlide(rangeValue?.[0] ?? new Date());
    }
  };

  function handlePress() {
    bottomSheetModalRef.current?.present();
    resetToInitialState();

    if (isOpen.value) {
      onDatePickerClosed && onDatePickerClosed();
    } else {
      onDatePickerOpened && onDatePickerOpened();
    }

    isOpen.value = withTiming(isOpen.value ? 0 : 1, {
      duration: ANIMATION_DURATION,
    });
  }

  function getYearRange(date: Date): { floor: number; ceil: number } {
    const year = moment(date).year();
    const start = Math.floor(year / 10) * 10;
    const end = start + 10;
    return { floor: start, ceil: end };
  }

  function generateYearsArray(date: Date): number[] {
    const { floor, ceil } = getYearRange(date);
    const years: number[] = [];
    for (let year = floor; year <= ceil; year++) {
      years.push(year);
    }
    return years;
  }

  const handleDecadeChange = (direction: "prev" | "next") => {
    setCurrentDecade(prev =>
      moment(prev)
        .add(direction === "prev" ? -10 : 10, "years")
        .toDate(),
    );
  };

  const formatDisplayValue = () => {
    if (mode === "single") {
      return value ? moment(value as Date)?.format("DD/MM/YYYY") : placeholder;
    }
    const [start, end] = value as DateRangeValue;
    if (start && end) {
      return `${moment(start).format("DD/MM/YYYY")} - ${moment(end).format(
        "DD/MM/YYYY",
      )}`;
    }
    if (start) {
      return moment(start).format("DD/MM/YYYY");
    }
    return placeholder;
  };

  const handleChooseDate = () => {
    if (mode === "single") {
      if (localDate) {
        (onChange as IDatePickerSingle["onChange"])?.(localDate as Date);
      }
    } else {
      const [start, end] = localDate as DateRangeValue;
      if (start && end) {
        (onChange as IDatePickerRange["onChange"])?.([start, end]);
      }
    }
    bottomSheetModalRef.current?.close();
  };

  const calendatData = useMemo(() => {
    return generateCalendarData(currentSlide);
  }, [currentSlide]);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
      resetToInitialState();
      isOpen.value = withTiming(1, { duration: ANIMATION_DURATION });
      onDatePickerOpened && onDatePickerOpened();
    },
    close: () => {
      bottomSheetModalRef.current?.close();
      isOpen.value = withTiming(0, { duration: ANIMATION_DURATION });
      onDatePickerClosed && onDatePickerClosed();
    },
    handleChooseDate,
    swipeLeft: () => {
      handleMonthChange("prev");
    },
    swipeRight: () => {
      handleMonthChange("next");
    },
    changeYear: () => {
      setIsYearsModalOpen(true);
    },
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {showInput && (
        <>
          {label && (
            <Text style={[styles.label, labelStyle]}>
              {label} {isRequired && <Text style={[styles.star]}>*</Text>}{" "}
            </Text>
          )}
          <TouchableOpacity
            onPress={handlePress}
            style={[
              styles.inputContainer,
              inputContainerStyle,
              isError && { borderColor: "red" },
            ]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={[styles.label, placeholderStyle]}>
                {formatDisplayValue()}
              </Text>
            </View>
            {isArrowShown && (
              <View style={[arrowContainerStyle]}>
                <Animated.View style={[animatedArrowStyle]}>
                  {customArrowIcon ? (
                    customArrowIcon
                  ) : (
                    <AngleDown size={arrowSize} color={arrowColor} />
                  )}
                </Animated.View>
              </View>
            )}
          </TouchableOpacity>
          {isError && (
            <Text style={[styles.error, errorMessageStyle]}>
              {errorMessage}
            </Text>
          )}
        </>
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={bottomSheetModalBackdrop}
        handleComponent={() => <></>}
        enableDynamicSizing={false}
        enablePanDownToClose
        onDismiss={resetToInitialState}
        snapPoints={[isIos ? "55%" : "60%"]}
        {...bottomSheetModalProps}>
        <View style={[styles.sheetContainer]}>
          {customHeader ?? (
            <View style={[styles.header]}>
              <TouchableOpacity
                onPress={() => handleMonthChange("prev")}
                hitSlop={25}>
                <Animated.View
                  style={[styles.leftArrow, animatedLeftArrowStyle]}>
                  <AngleDown size={18} color="#333" />
                </Animated.View>
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={25}
                onPress={() => {
                  setIsYearsModalOpen(true);
                }}>
                <Text style={[styles.headerDate]}>
                  {moment(currentSlide)?.format("MMMM Y")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMonthChange("next")}
                hitSlop={25}>
                <Animated.View
                  style={[styles.rightArrow, animatedRightArrowStyle]}>
                  <AngleDown size={18} color="#333" />
                </Animated.View>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            numColumns={7}
            bounces={false}
            contentContainerStyle={styles.dateContainer}
            data={calendatData}
            renderItem={({ item, index }) => {
              const isLastInRow = (index + 1) % 7 === 0;

              if (item.type === "weekday") {
                return (
                  <View
                    style={[styles.cell, !isLastInRow && { marginRight: 4 }]}>
                    <Text style={styles.weekDay}>{item.label}</Text>
                  </View>
                );
              }

              return (
                <DateCell
                  mode={mode}
                  rangeDateTextColor={rangeDateTextColor}
                  rangeDateBackgroundColor={rangeDateBackgroundColor}
                  farDateBackgroundColor={farDateBackgroundColor}
                  farDateTextColor={farDateTextColor}
                  activeDateBackgroundColor={activeDateBackgroundColor}
                  activeDateTextColor={activeDateTextColor}
                  disabledDateTextColor={disabledDateTextColor}
                  dateTextColor={dateTextColor}
                  dateBackgroundColor={dateBackgroundColor}
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  localDate={localDate}
                  setLocalDate={setLocalDate}
                  isLastInRow={isLastInRow}
                  cellType={item?.type}
                  label={item?.label}
                  minDate={minDate}
                  maxDate={maxDate}
                  showFarDates={showFarDates}
                  dateCellStyle={dateCellStyle}
                  startDateCellStyle={startDateCellStyle}
                  endDateCellStyle={endDateCellStyle}
                />
              );
            }}
          />
          {customFooter ?? (
            <View style={[styles.buttonContainer]}>
              <Button
                isOutlined
                {...cancelButtonProps}
                onPress={() => {
                  resetToInitialState();
                  bottomSheetModalRef.current?.close();
                }}
                textStyle={[styles.buttonText, cancelButtonProps?.textStyle]}
                containerStyle={[
                  styles.button,
                  cancelButtonProps?.containerStyle,
                ]}>
                {cancelButtonText}
              </Button>
              <Button
                {...chooseDateButtonProps}
                onPress={handleChooseDate}
                textStyle={[
                  styles.buttonText,
                  chooseDateButtonProps?.textStyle,
                ]}
                containerStyle={[
                  styles.button,
                  chooseDateButtonProps?.containerStyle,
                ]}>
                {chooseDateButtonText}
              </Button>
            </View>
          )}
        </View>
        <Modal
          containerStyle={styles.yearModal}
          isOpen={isYearsModalOpen}
          setIsOpen={setIsYearsModalOpen}>
          <View style={[styles.header, { paddingHorizontal: 0 }]}>
            <TouchableOpacity
              onPress={() => handleDecadeChange("prev")}
              hitSlop={25}>
              <Animated.View style={[styles.leftArrow, animatedLeftArrowStyle]}>
                <AngleDown size={18} color="#333" />
              </Animated.View>
            </TouchableOpacity>
            <Text style={[styles.headerDate]}>
              {`${getYearRange(currentDecade).floor} - ${
                getYearRange(currentDecade).ceil
              }`}
            </Text>
            <TouchableOpacity
              onPress={() => handleDecadeChange("next")}
              hitSlop={25}>
              <Animated.View
                style={[styles.rightArrow, animatedRightArrowStyle]}>
                <AngleDown size={18} color="#333" />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <FlatList
            numColumns={3}
            contentContainerStyle={[
              {
                gap: YEAR_COLUMN_GAP,
              },
            ]}
            onLayout={event => {
              setYearContainerWidth(event.nativeEvent.layout.width);
            }}
            data={generateYearsArray(currentDecade)}
            renderItem={({ item, index }) => (
              <YearCell
                activeYearTextColor={activeDateTextColor}
                activeYearBackgroundColor={activeDateBackgroundColor}
                setSelectedYear={setSelectedYear}
                selectedYear={selectedYear}
                yearContainerWidth={yearContainerWidth}
                index={index}
                year={item?.toString()}
              />
            )}
          />
          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}>
            <Button
              onPress={() => {
                setIsYearsModalOpen(false);
                setIsMonthsModalOpen(true);
              }}
              textStyle={[styles.buttonText, chooseYearButtonProps?.textStyle]}
              containerStyle={[
                {
                  padding: 12,
                  flex: 1,
                },
                chooseYearButtonProps?.containerStyle,
              ]}>
              {chooseYearButtonText}
            </Button>
          </View>
        </Modal>
        <Modal
          containerStyle={styles.yearModal}
          isOpen={isMonthsModalOpen}
          setIsOpen={setIsMonthsModalOpen}>
          <FlatList
            numColumns={3}
            contentContainerStyle={[
              {
                gap: YEAR_COLUMN_GAP,
              },
            ]}
            onLayout={event => {
              setYearContainerWidth(event.nativeEvent.layout.width);
            }}
            data={Array.from({ length: 12 }).map((item, index) => index)}
            renderItem={({ item, index }) => (
              <MonthCell
                activeMonthTextColor={activeDateTextColor}
                activeMonthBackgroundColor={activeDateBackgroundColor}
                month={item}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                monthContainerWidth={yearContainerWidth}
                index={index}
              />
            )}
          />
          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}>
            <Button
              onPress={() => {
                setCurrentSlide(
                  moment().year(selectedYear).month(selectedMonth).toDate(),
                );
                setIsMonthsModalOpen(false);
              }}
              textStyle={[styles.buttonText, chooseMonthButtonProps?.textStyle]}
              containerStyle={[
                {
                  padding: 12,
                  flex: 1,
                },
                chooseMonthButtonProps?.containerStyle,
              ]}>
              {chooseMonthButtonText}
            </Button>
          </View>
        </Modal>
      </BottomSheetModal>
    </View>
  );
}

export default forwardRef(DatePicker) as <
  T extends DateMode = "single" | "range",
>(
  props: (T extends "range" ? IDatePickerRange : IDatePickerSingle) & {
    ref?: React.Ref<IDatePickerRef>;
  },
) => ReturnType<typeof DatePicker>;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputContainer: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.25)",
    minHeight: 50,
  },
  label: {
    color: "rgba(0,0,0,.75)",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginStart: 8,
  },
  star: {
    color: "red",
  },
  sheetContainer: {
    padding: 16,
    flex: 1,
    gap: 14,
    ...(isIos && { paddingBottom: 42 }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerDate: {
    fontSize: 16,
    fontWeight: "700",
  },
  rightArrow: {},
  leftArrow: {},
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    gap: 6,
  },
  dateContainer: {
    gap: 4,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
  },
  weekDay: {
    fontSize: 15,
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 12,
  },
  button: {
    flex: 0.5,
  },
  buttonText: {
    fontWeight: "700",
  },
  yearModal: {
    width: 250,
    minWidth: 220,
    padding: 12,
    paddingTop: 14,
    gap: 12,
    bottom: 50,
  },
  yearCell: {
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  yearText: {
    color: "#333",
    fontWeight: "500",
  },
});
