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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bottom_sheet_1 = require("@gorhom/bottom-sheet");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const Button_1 = __importDefault(require("./Button"));
const Modal_1 = __importDefault(require("./Modal"));
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const isIos = react_native_1.Platform.OS === "ios";
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
const DEFAULT_CURRENT_SLIDE_FORMATTER = (date) => (0, moment_1.default)(date).format("MMMM Y");
const AnimatedPressable = react_native_reanimated_1.default.createAnimatedComponent(react_native_1.Pressable);
function AngleDown({ size = 20, color = DEFAULT_ARROW_COLOR, }) {
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 448 512">
      <react_native_svg_1.Path fill={color} d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
    </react_native_svg_1.default>);
}
function generateCalendarData(date, customWeekDays) {
    var _a;
    const m = (0, moment_1.default)(date);
    const orderedWeekdays = (_a = (customWeekDays
        ? customWeekDays
        : [
            moment_1.default.weekdaysShort()[1],
            moment_1.default.weekdaysShort()[2],
            moment_1.default.weekdaysShort()[3],
            moment_1.default.weekdaysShort()[4],
            moment_1.default.weekdaysShort()[5],
            moment_1.default.weekdaysShort()[6],
            moment_1.default.weekdaysShort()[0],
        ])) === null || _a === void 0 ? void 0 : _a.map((day) => ({
        type: "weekday",
        label: day,
    }));
    const startOfMonth = m.clone().startOf("month");
    const numberOfdaysInCurrentMonth = m.daysInMonth();
    const numberOfPreviousDays = (startOfMonth.day() + 6) % 7;
    const previousMonth = m.clone().subtract(1, "month");
    const numberOfDaysInPreviousMonth = previousMonth.daysInMonth();
    const previousDays = Array.from({ length: numberOfPreviousDays }).map((_, index) => {
        const day = previousMonth
            .clone()
            .date(numberOfDaysInPreviousMonth - numberOfPreviousDays + index + 1)
            .toDate();
        return { type: "prev", label: day };
    });
    const currentDays = Array.from({ length: numberOfdaysInCurrentMonth }).map((_, index) => {
        const day = startOfMonth
            .clone()
            .date(index + 1)
            .toDate();
        return { type: "current", label: day };
    });
    const totalDaysSoFar = (previousDays === null || previousDays === void 0 ? void 0 : previousDays.length) + (currentDays === null || currentDays === void 0 ? void 0 : currentDays.length);
    const totalWeeks = Math.ceil(totalDaysSoFar / 7);
    const totalCells = totalWeeks > 5 ? 42 : NUMBER_OF_DATE_CELLS_PER_SLIDE;
    const remainingDaysToFill = totalCells - totalDaysSoFar;
    const nextMonth = m.clone().add(1, "month");
    const nextDays = Array.from({ length: remainingDaysToFill }).map((_, index) => {
        const day = nextMonth
            .clone()
            .date(index + 1)
            .toDate();
        return { type: "next", label: day };
    });
    return [...orderedWeekdays, ...previousDays, ...currentDays, ...nextDays];
}
function MonthCell({ month, index, monthContainerWidth, selectedMonth, setSelectedMonth, activeMonthBackgroundColor, activeMonthTextColor, monthCellStyle, }) {
    const isActiveCell = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(() => {
        isActiveCell.value = (0, react_native_reanimated_1.withTiming)(month === selectedMonth ? 1 : 0);
    }, [month, selectedMonth]);
    const animatedContainerStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const backgroundColor = (0, react_native_reanimated_1.interpolateColor)(isActiveCell.value, [0, 1], ["transparent", activeMonthBackgroundColor]);
        return {
            backgroundColor,
        };
    });
    const animatedTextStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const color = (0, react_native_reanimated_1.interpolateColor)(isActiveCell.value, [0, 1], ["#333", activeMonthTextColor]);
        return {
            color,
        };
    });
    if (!monthContainerWidth)
        return null;
    return (<AnimatedPressable onPress={() => {
            setSelectedMonth(month);
        }} style={[
            styles.yearCell,
            {
                width: (monthContainerWidth - YEAR_COLUMN_GAP * 2) / 3,
                marginEnd: (index + 1) % 3 === 0 ? 0 : YEAR_COLUMN_GAP,
            },
            animatedContainerStyle,
            monthCellStyle,
        ]}>
      <react_native_reanimated_1.default.Text style={[styles.yearText, animatedTextStyle]}>
        {(0, moment_1.default)().month(month).format("MMM")}
      </react_native_reanimated_1.default.Text>
    </AnimatedPressable>);
}
function YearCell({ year, index, yearContainerWidth, selectedYear, setSelectedYear, activeYearBackgroundColor, activeYearTextColor, yearCellStyle, }) {
    const isActiveCell = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(() => {
        isActiveCell.value = (0, react_native_reanimated_1.withTiming)(year === (selectedYear === null || selectedYear === void 0 ? void 0 : selectedYear.toString()) ? 1 : 0);
    }, [year, selectedYear]);
    const animatedContainerStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const backgroundColor = (0, react_native_reanimated_1.interpolateColor)(isActiveCell.value, [0, 1], ["transparent", activeYearBackgroundColor]);
        return {
            backgroundColor,
        };
    });
    const animatedTextStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const color = (0, react_native_reanimated_1.interpolateColor)(isActiveCell.value, [0, 1], ["#333", activeYearTextColor]);
        return {
            color,
        };
    });
    if (!yearContainerWidth)
        return null;
    return (<AnimatedPressable onPress={() => {
            setSelectedYear(parseInt(year));
        }} style={[
            styles.yearCell,
            {
                width: (yearContainerWidth - YEAR_COLUMN_GAP * 2) / 3,
                marginEnd: (index + 1) % 3 === 0 ? 0 : YEAR_COLUMN_GAP,
            },
            animatedContainerStyle,
            yearCellStyle,
        ]}>
      <react_native_reanimated_1.default.Text style={[styles.yearText, animatedTextStyle]}>
        {year}
      </react_native_reanimated_1.default.Text>
    </AnimatedPressable>);
}
function DateCell({ isLastInRow, label, cellType, mode, localDate, setLocalDate, currentSlide, setCurrentSlide, activeDateBackgroundColor, activeDateTextColor, dateTextColor, dateBackgroundColor, farDateTextColor, farDateBackgroundColor, rangeDateTextColor, rangeDateBackgroundColor, disabledDateTextColor, showFarDates, dateCellStyle, startDateCellStyle, endDateCellStyle, minDate, maxDate, }) {
    const isActive = (0, react_native_reanimated_1.useSharedValue)(0);
    const isInRange = (0, react_native_reanimated_1.useSharedValue)(0);
    const isDateNotInBounds = (minDate && (0, moment_1.default)(label).isBefore(minDate)) ||
        (maxDate && (0, moment_1.default)(label).isAfter(maxDate));
    (0, react_1.useEffect)(() => {
        if (cellType !== "current") {
            isActive.value = 0;
            isInRange.value = 0;
            return;
        }
        if (mode === "single") {
            const isSame = (0, moment_1.default)(localDate).isSame(label, "day");
            isActive.value = (0, react_native_reanimated_1.withSpring)(isSame ? 1 : 0);
            isInRange.value = 0;
        }
        else {
            const [start, end] = localDate;
            const isStart = start && (0, moment_1.default)(start).isSame(label, "day");
            const isEnd = end && (0, moment_1.default)(end).isSame(label, "day");
            const inRange = start && end && (0, moment_1.default)(label).isBetween(start, end, "day", "()");
            isActive.value = (0, react_native_reanimated_1.withSpring)(isStart || isEnd ? 1 : 0);
            isInRange.value = (0, react_native_reanimated_1.withTiming)(inRange ? 1 : 0);
        }
    }, [localDate, label, mode, cellType]);
    const animatedContainerStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        let baseBackgroundColor = farDateBackgroundColor;
        if (cellType === "current") {
            baseBackgroundColor = dateBackgroundColor;
            if (mode === "range" && isInRange.value > 0) {
                baseBackgroundColor = (0, react_native_reanimated_1.interpolateColor)(isInRange.value, [0, 1], [dateBackgroundColor, rangeDateBackgroundColor]);
            }
            if (isActive.value > 0) {
                baseBackgroundColor = (0, react_native_reanimated_1.interpolateColor)(isActive.value, [0, 1], [baseBackgroundColor, activeDateBackgroundColor]);
            }
        }
        return {
            backgroundColor: baseBackgroundColor,
        };
    });
    const animatedTextStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        let baseColor = farDateTextColor;
        if (cellType === "current") {
            baseColor = dateTextColor;
            if (mode === "range" && isInRange.value > 0) {
                baseColor = (0, react_native_reanimated_1.interpolateColor)(isInRange.value, [0, 1], [dateTextColor, rangeDateTextColor]);
            }
            if (isActive.value > 0) {
                baseColor = (0, react_native_reanimated_1.interpolateColor)(isActive.value, [0, 1], [baseColor, activeDateTextColor]);
            }
        }
        return {
            color: isDateNotInBounds ? disabledDateTextColor : baseColor,
            fontWeight: "500",
        };
    });
    const handlePress = () => {
        if (cellType === "prev") {
            setCurrentSlide((0, moment_1.default)(currentSlide).subtract(1, "month").toDate());
        }
        else if (cellType === "next") {
            setCurrentSlide((0, moment_1.default)(currentSlide).add(1, "month").toDate());
        }
        else {
            if (mode === "single") {
                setLocalDate(label);
            }
            else {
                const [start, end] = localDate;
                if (!start || (start && end)) {
                    setLocalDate([label, null]);
                }
                else {
                    const newEnd = (0, moment_1.default)(label).isBefore(start) ? start : label;
                    const newStart = (0, moment_1.default)(label).isBefore(start) ? label : start;
                    setLocalDate([newStart, newEnd]);
                }
            }
        }
    };
    const isStartDateCell = (0, react_1.useMemo)(() => {
        var _a;
        return (cellType === "current" &&
            mode === "range" &&
            localDate &&
            ((_a = (0, moment_1.default)(localDate[0])) === null || _a === void 0 ? void 0 : _a.isSame(label)));
    }, [cellType, localDate, label]);
    const isEndDateCell = (0, react_1.useMemo)(() => {
        var _a;
        return (cellType === "current" &&
            mode === "range" &&
            localDate &&
            ((_a = (0, moment_1.default)(localDate[1])) === null || _a === void 0 ? void 0 : _a.isSame(label)));
    }, [cellType, localDate, label]);
    return (<AnimatedPressable disabled={isDateNotInBounds || (!showFarDates && cellType !== "current")} onPress={handlePress} style={[
            styles.cell,
            !isLastInRow && { marginRight: 4 },
            !showFarDates && cellType !== "current" && { opacity: 0 },
            dateCellStyle,
            isStartDateCell && startDateCellStyle,
            isEndDateCell && endDateCellStyle,
            animatedContainerStyle,
        ]}>
      <react_native_reanimated_1.default.Text style={[animatedTextStyle]}>
        {(0, moment_1.default)(label).format("D")}
      </react_native_reanimated_1.default.Text>
    </AnimatedPressable>);
}
function DatePicker({ containerStyle, inputContainerStyle, labelStyle, isRequired = false, isError, errorMessage, errorMessageStyle, label, placeholder = "Select date", onChange, value, mode = "single", isArrowShown = true, arrowColor = DEFAULT_ARROW_COLOR, arrowSize = DEFAULT_ARROW_SIZE, placeholderStyle, arrowContainerStyle, customArrowIcon, onDatePickerOpened, onDatePickerClosed, customArrowRotation = DEFAULT_ARROW_ROTATION, bottomSheetModalProps, cancelButtonProps, chooseDateButtonProps, chooseYearButtonProps, chooseMonthButtonProps, chooseYearButtonText = "Choose year", chooseMonthButtonText = "Choose month", cancelButtonText = "Cancel", chooseDateButtonText = "Choose date", activeDateTextColor = DEFAULT_ACTIVE_DATE_TEXT_COLOR, activeDateBackgroundColor = DEFAULT_ACTIVE_DATE_BACKGROUND_COLOR, dateTextColor = DEFAULT_DATE_TEXT_COLOR, dateBackgroundColor = DEFAULT_DATE_BACKGROUND_COLOR, farDateTextColor = DEFAULT_FAR_DATE_TEXT_COLOR, farDateBackgroundColor = DEFAULT_FAR_DATE_BACKGROUND_COLOR, rangeDateTextColor = DEFAULT_RANGE_DATE_TEXT_COLOR, rangeDateBackgroundColor = DEFAULT_RANGE_DATE_BACKGROUND_COLOR, disabledDateTextColor = DEFAULT_DISABLED_DATE_TEXT_COLOR, customHeader, customFooter, showInput = true, showFarDates = true, dateCellStyle, startDateCellStyle, endDateCellStyle, customWeekDays, currentSlideFormatter = DEFAULT_CURRENT_SLIDE_FORMATTER, yearCellStyle, monthCellStyle, onSlideChange, minDate, maxDate, }, ref) {
    const isOpen = (0, react_native_reanimated_1.useSharedValue)(0);
    const bottomSheetModalRef = (0, react_1.useRef)(null);
    const [localDate, setLocalDate] = (0, react_1.useState)(value);
    const getInitialSlide = () => {
        var _a, _b;
        if (mode === "single") {
            return (_a = value) !== null && _a !== void 0 ? _a : new Date();
        }
        return (_b = value === null || value === void 0 ? void 0 : value[0]) !== null && _b !== void 0 ? _b : new Date();
    };
    const [currentSlide, setCurrentSlide] = (0, react_1.useState)(getInitialSlide());
    const [isYearsModalOpen, setIsYearsModalOpen] = (0, react_1.useState)(false);
    const [isMonthsModalOpen, setIsMonthsModalOpen] = (0, react_1.useState)(false);
    const [currentDecade, setCurrentDecade] = (0, react_1.useState)(getInitialSlide());
    const [yearContainerWidth, setYearContainerWidth] = (0, react_1.useState)(0);
    const [selectedYear, setSelectedYear] = (0, react_1.useState)(currentSlide === null || currentSlide === void 0 ? void 0 : currentSlide.getFullYear());
    const [selectedMonth, setSelectedMonth] = (0, react_1.useState)(currentSlide === null || currentSlide === void 0 ? void 0 : currentSlide.getMonth());
    (0, react_1.useEffect)(() => {
        setCurrentDecade(currentSlide);
        onSlideChange && onSlideChange(currentSlide);
    }, [currentSlide]);
    const leftArrowScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const rightArrowScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const animatedLeftArrowStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: leftArrowScale.value }, { rotate: "90deg" }],
    }));
    const animatedRightArrowStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: rightArrowScale.value }, { rotate: "-90deg" }],
    }));
    const handleMonthChange = (direction) => {
        const isPrev = direction === "prev";
        setCurrentSlide((prev) => (0, moment_1.default)(prev)
            .add(isPrev ? -1 : 1, "month")
            .toDate());
    };
    (0, react_1.useEffect)(() => {
        if (value) {
            setLocalDate(value);
            if (mode === "single") {
                setCurrentSlide(value);
            }
            else {
                const rangeValue = value;
                if (rangeValue[0])
                    setCurrentSlide(rangeValue[0]);
            }
        }
    }, [value, mode]);
    const bottomSheetModalBackdrop = (0, react_1.useCallback)((props) => (<bottom_sheet_1.BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0}/>), []);
    const animatedArrowStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const rotation = (0, react_native_reanimated_1.interpolate)(isOpen.value, [0, 1], [0, customArrowRotation], react_native_reanimated_1.Extrapolation.CLAMP);
        return {
            transform: [{ rotate: `${rotation}deg` }],
        };
    });
    const resetToInitialState = () => {
        var _a, _b;
        setLocalDate(value);
        if (mode === "single") {
            setCurrentSlide((_a = value) !== null && _a !== void 0 ? _a : new Date());
        }
        else {
            const rangeValue = value;
            setCurrentSlide((_b = rangeValue === null || rangeValue === void 0 ? void 0 : rangeValue[0]) !== null && _b !== void 0 ? _b : new Date());
        }
    };
    function handlePress() {
        var _a;
        (_a = bottomSheetModalRef.current) === null || _a === void 0 ? void 0 : _a.present();
        resetToInitialState();
        if (isOpen.value) {
            onDatePickerClosed && onDatePickerClosed();
        }
        else {
            onDatePickerOpened && onDatePickerOpened();
        }
        isOpen.value = (0, react_native_reanimated_1.withTiming)(isOpen.value ? 0 : 1, {
            duration: ANIMATION_DURATION,
        });
    }
    function getYearRange(date) {
        const year = (0, moment_1.default)(date).year();
        const start = Math.floor(year / 10) * 10;
        const end = start + 10;
        return { floor: start, ceil: end };
    }
    function generateYearsArray(date) {
        const { floor, ceil } = getYearRange(date);
        const years = [];
        for (let year = floor; year <= ceil; year++) {
            years.push(year);
        }
        return years;
    }
    const handleDecadeChange = (direction) => {
        setCurrentDecade((prev) => (0, moment_1.default)(prev)
            .add(direction === "prev" ? -10 : 10, "years")
            .toDate());
    };
    const formatDisplayValue = () => {
        var _a;
        if (mode === "single") {
            return value ? (_a = (0, moment_1.default)(value)) === null || _a === void 0 ? void 0 : _a.format("DD/MM/YYYY") : placeholder;
        }
        const [start, end] = value;
        if (start && end) {
            return `${(0, moment_1.default)(start).format("DD/MM/YYYY")} - ${(0, moment_1.default)(end).format("DD/MM/YYYY")}`;
        }
        if (start) {
            return (0, moment_1.default)(start).format("DD/MM/YYYY");
        }
        return placeholder;
    };
    const handleChooseDate = () => {
        var _a;
        if (mode === "single") {
            if (localDate) {
                onChange === null || onChange === void 0 ? void 0 : onChange(localDate);
            }
        }
        else {
            const [start, end] = localDate;
            if (start && end) {
                onChange === null || onChange === void 0 ? void 0 : onChange([start, end]);
            }
        }
        (_a = bottomSheetModalRef.current) === null || _a === void 0 ? void 0 : _a.close();
    };
    const calendarData = (0, react_1.useMemo)(() => {
        return generateCalendarData(currentSlide, customWeekDays);
    }, [currentSlide]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        open: () => {
            var _a;
            (_a = bottomSheetModalRef.current) === null || _a === void 0 ? void 0 : _a.present();
            resetToInitialState();
            isOpen.value = (0, react_native_reanimated_1.withTiming)(1, { duration: ANIMATION_DURATION });
            onDatePickerOpened && onDatePickerOpened();
        },
        close: () => {
            var _a;
            (_a = bottomSheetModalRef.current) === null || _a === void 0 ? void 0 : _a.close();
            isOpen.value = (0, react_native_reanimated_1.withTiming)(0, { duration: ANIMATION_DURATION });
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
    return (<react_native_1.View style={[styles.container, containerStyle]}>
      {showInput && (<>
          {label && (<react_native_1.Text style={[styles.label, labelStyle]}>
              {label} {isRequired && <react_native_1.Text style={[styles.star]}>*</react_native_1.Text>}{" "}
            </react_native_1.Text>)}
          <react_native_1.TouchableOpacity onPress={handlePress} style={[
                styles.inputContainer,
                inputContainerStyle,
                isError && { borderColor: "red" },
            ]}>
            <react_native_1.View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <react_native_1.Text style={[styles.label, placeholderStyle]}>
                {formatDisplayValue()}
              </react_native_1.Text>
            </react_native_1.View>
            {isArrowShown && (<react_native_1.View style={[arrowContainerStyle]}>
                <react_native_reanimated_1.default.View style={[animatedArrowStyle]}>
                  {customArrowIcon ? (customArrowIcon) : (<AngleDown size={arrowSize} color={arrowColor}/>)}
                </react_native_reanimated_1.default.View>
              </react_native_1.View>)}
          </react_native_1.TouchableOpacity>
          {isError && (<react_native_1.Text style={[styles.error, errorMessageStyle]}>
              {errorMessage}
            </react_native_1.Text>)}
        </>)}
      <bottom_sheet_1.BottomSheetModal ref={bottomSheetModalRef} backdropComponent={bottomSheetModalBackdrop} handleComponent={() => <></>} enableDynamicSizing={false} enablePanDownToClose onDismiss={resetToInitialState} snapPoints={[isIos ? "55%" : "60.5%"]} {...bottomSheetModalProps}>
        <react_native_1.View style={[styles.sheetContainer]}>
          {customHeader !== null && customHeader !== void 0 ? customHeader : (<react_native_1.View style={[styles.header]}>
              <react_native_1.TouchableOpacity onPress={() => handleMonthChange("prev")} hitSlop={25}>
                <react_native_reanimated_1.default.View style={[styles.leftArrow, animatedLeftArrowStyle]}>
                  <AngleDown size={18} color="#333"/>
                </react_native_reanimated_1.default.View>
              </react_native_1.TouchableOpacity>
              <react_native_1.TouchableOpacity hitSlop={25} onPress={() => {
                setIsYearsModalOpen(true);
            }}>
                <react_native_1.Text style={[styles.headerDate]}>
                  {currentSlideFormatter(currentSlide)}
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>
              <react_native_1.TouchableOpacity onPress={() => handleMonthChange("next")} hitSlop={25}>
                <react_native_reanimated_1.default.View style={[styles.rightArrow, animatedRightArrowStyle]}>
                  <AngleDown size={18} color="#333"/>
                </react_native_reanimated_1.default.View>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>)}
          <react_native_gesture_handler_1.FlatList numColumns={7} bounces={false} contentContainerStyle={styles.dateContainer} showsVerticalScrollIndicator={false} data={calendarData} renderItem={({ item, index }) => {
            const isLastInRow = (index + 1) % 7 === 0;
            if (item.type === "weekday") {
                return (<react_native_1.View style={[styles.cell, !isLastInRow && { marginRight: 4 }]}>
                    <react_native_1.Text style={styles.weekDay}>{item.label}</react_native_1.Text>
                  </react_native_1.View>);
            }
            return (<DateCell mode={mode} rangeDateTextColor={rangeDateTextColor} rangeDateBackgroundColor={rangeDateBackgroundColor} farDateBackgroundColor={farDateBackgroundColor} farDateTextColor={farDateTextColor} activeDateBackgroundColor={activeDateBackgroundColor} activeDateTextColor={activeDateTextColor} disabledDateTextColor={disabledDateTextColor} dateTextColor={dateTextColor} dateBackgroundColor={dateBackgroundColor} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} localDate={localDate} setLocalDate={setLocalDate} isLastInRow={isLastInRow} cellType={item === null || item === void 0 ? void 0 : item.type} label={item === null || item === void 0 ? void 0 : item.label} minDate={minDate} maxDate={maxDate} showFarDates={showFarDates} dateCellStyle={dateCellStyle} startDateCellStyle={startDateCellStyle} endDateCellStyle={endDateCellStyle}/>);
        }}/>
          {customFooter !== null && customFooter !== void 0 ? customFooter : (<react_native_1.View style={[styles.buttonContainer]}>
              <Button_1.default isOutlined {...cancelButtonProps} onPress={() => {
                var _a;
                resetToInitialState();
                (_a = bottomSheetModalRef.current) === null || _a === void 0 ? void 0 : _a.close();
            }} textStyle={[styles.buttonText, cancelButtonProps === null || cancelButtonProps === void 0 ? void 0 : cancelButtonProps.textStyle]} containerStyle={[
                styles.button,
                cancelButtonProps === null || cancelButtonProps === void 0 ? void 0 : cancelButtonProps.containerStyle,
            ]}>
                {cancelButtonText}
              </Button_1.default>
              <Button_1.default {...chooseDateButtonProps} onPress={handleChooseDate} textStyle={[
                styles.buttonText,
                chooseDateButtonProps === null || chooseDateButtonProps === void 0 ? void 0 : chooseDateButtonProps.textStyle,
            ]} containerStyle={[
                styles.button,
                chooseDateButtonProps === null || chooseDateButtonProps === void 0 ? void 0 : chooseDateButtonProps.containerStyle,
            ]}>
                {chooseDateButtonText}
              </Button_1.default>
            </react_native_1.View>)}
        </react_native_1.View>
        <Modal_1.default containerStyle={styles.yearModal} isOpen={isYearsModalOpen} setIsOpen={setIsYearsModalOpen}>
          <react_native_1.View style={[styles.header, { paddingHorizontal: 0 }]}>
            <react_native_1.TouchableOpacity onPress={() => handleDecadeChange("prev")} hitSlop={25}>
              <react_native_reanimated_1.default.View style={[styles.leftArrow, animatedLeftArrowStyle]}>
                <AngleDown size={18} color="#333"/>
              </react_native_reanimated_1.default.View>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text style={[styles.headerDate]}>
              {`${getYearRange(currentDecade).floor} - ${getYearRange(currentDecade).ceil}`}
            </react_native_1.Text>
            <react_native_1.TouchableOpacity onPress={() => handleDecadeChange("next")} hitSlop={25}>
              <react_native_reanimated_1.default.View style={[styles.rightArrow, animatedRightArrowStyle]}>
                <AngleDown size={18} color="#333"/>
              </react_native_reanimated_1.default.View>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_gesture_handler_1.FlatList numColumns={3} contentContainerStyle={[
            {
                gap: YEAR_COLUMN_GAP,
                minHeight: 180,
            },
        ]} onLayout={(event) => {
            setYearContainerWidth(event.nativeEvent.layout.width);
        }} data={generateYearsArray(currentDecade)} renderItem={({ item, index }) => (<YearCell key={index} activeYearTextColor={activeDateTextColor} activeYearBackgroundColor={activeDateBackgroundColor} setSelectedYear={setSelectedYear} selectedYear={selectedYear} yearContainerWidth={yearContainerWidth} yearCellStyle={yearCellStyle} year={item === null || item === void 0 ? void 0 : item.toString()} index={index}/>)}/>
          <react_native_1.View style={{
            flexDirection: "row",
            gap: 8,
        }}>
            <Button_1.default onPress={() => {
            setIsYearsModalOpen(false);
            setIsMonthsModalOpen(true);
        }} textStyle={[styles.buttonText, chooseYearButtonProps === null || chooseYearButtonProps === void 0 ? void 0 : chooseYearButtonProps.textStyle]} containerStyle={[
            {
                padding: 12,
                flex: 1,
            },
            chooseYearButtonProps === null || chooseYearButtonProps === void 0 ? void 0 : chooseYearButtonProps.containerStyle,
        ]}>
              {chooseYearButtonText}
            </Button_1.default>
          </react_native_1.View>
        </Modal_1.default>
        <Modal_1.default containerStyle={styles.yearModal} isOpen={isMonthsModalOpen} setIsOpen={setIsMonthsModalOpen}>
          <react_native_gesture_handler_1.FlatList numColumns={3} contentContainerStyle={[
            {
                gap: YEAR_COLUMN_GAP,
            },
        ]} onLayout={(event) => {
            setYearContainerWidth(event.nativeEvent.layout.width);
        }} data={Array.from({ length: 12 }).map((item, index) => index)} renderItem={({ item, index }) => (<MonthCell key={index} activeMonthTextColor={activeDateTextColor} activeMonthBackgroundColor={activeDateBackgroundColor} month={item} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} monthContainerWidth={yearContainerWidth} monthCellStyle={monthCellStyle} index={index}/>)}/>
          <react_native_1.View style={{
            flexDirection: "row",
            gap: 8,
        }}>
            <Button_1.default onPress={() => {
            setCurrentSlide((0, moment_1.default)().year(selectedYear).month(selectedMonth).toDate());
            setIsMonthsModalOpen(false);
        }} textStyle={[styles.buttonText, chooseMonthButtonProps === null || chooseMonthButtonProps === void 0 ? void 0 : chooseMonthButtonProps.textStyle]} containerStyle={[
            {
                padding: 12,
                flex: 1,
            },
            chooseMonthButtonProps === null || chooseMonthButtonProps === void 0 ? void 0 : chooseMonthButtonProps.containerStyle,
        ]}>
              {chooseMonthButtonText}
            </Button_1.default>
          </react_native_1.View>
        </Modal_1.default>
      </bottom_sheet_1.BottomSheetModal>
    </react_native_1.View>);
}
exports.default = (0, react_1.forwardRef)(DatePicker);
const styles = react_native_1.StyleSheet.create({
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
    sheetContainer: Object.assign({ padding: 16, flex: 1, gap: 14 }, (isIos && { paddingBottom: 42 })),
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
