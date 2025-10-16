# rn-awesome-date-picker

A highly customizable and animated date picker component for React Native, built with **React Native Reanimated** and featuring both single date and date range selection modes.

![Preview text](https://github.com/Dhia-Ben-Hamouda/rn-awesome-date-picker/blob/main/src/assets/preview.gif)

## ✨ Features

- 📅 Single date and date range selection modes
- 🎨 Fully customizable colors and styles
- ✨ Smooth animations with React Native Reanimated
- 📱 Bottom sheet modal integration
- 🗓️ Year and month picker modals
- 🚫 Min/Max date constraints
- 📍 Custom date cell styling for start/end dates
- 🎯 Imperative API via refs
- 🌐 Works with both Android and iOS

## 📦 Installation

```bash
npm install rn-awesome-date-picker
# or
yarn add rn-awesome-date-picker
```

Then install and setup the required peer dependencies:

```bash
npm install react-native-reanimated react-native-worklets react-native-gesture-handler react-native-linear-gradient react-native-svg @gorhom/bottom-sheet
```

## 🚀 Usage

### Setup Requirements

Before using the DatePicker, make sure your app is properly configured with the required wrappers:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {/* Date Picker Usage */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

### Single Date Selection

```tsx
import DatePicker from "rn-awesome-date-picker";

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      mode="single"
      value={date}
      onChange={(newDate) => setDate(newDate)}
      label="Select Date"
      placeholder="Choose a date"
    />
  );
}
```

### Date Range Selection

```tsx
import DatePicker, { type DateRangeValue } from "rn-awesome-date-picker";

function App() {
  const [dateRange, setDateRange] = useState<DateRangeValue>([null, null]);

  return (
    <DatePicker
      mode="range"
      value={dateRange}
      onChange={(newRange) => setDateRange(newRange)}
      label="Select Date Range"
      placeholder="Choose dates"
    />
  );
}
```

### With Ref (Imperative API)

```tsx
import DatePicker, { type DatePickerRef } from "rn-awesome-datepicker";

function App() {
  const datePickerRef = useRef<DatePickerRef>(null);
  const [date, setDate] = useState<Date | null>(null);

  return (
    <>
      <DatePicker
        ref={datePickerRef}
        mode="single"
        value={date}
        onChange={(newDate) => setDate(newDate)}
        showInput={false}
      />
      <Button onPress={() => datePickerRef.current?.open()}>
        Open Date Picker
      </Button>
    </>
  );
}
```

## 🔧 Props

### Base Props (Common to both modes)

| Prop                    | Type                       | Default          | Description                          |
| ----------------------- | -------------------------- | ---------------- | ------------------------------------ |
| `mode`                  | `"single" \| "range"`      | `"single"`       | Selection mode                       |
| `value`                 | `Date \| DateRangeValue`   | **required**     | Current selected date(s)             |
| `onChange`              | `function`                 | `undefined`      | Callback when date changes           |
| `label`                 | `string`                   | `undefined`      | Label text above input               |
| `placeholder`           | `string`                   | `"Select date"`  | Placeholder text                     |
| `isRequired`            | `boolean`                  | `false`          | Shows asterisk if required           |
| `isError`               | `boolean`                  | `false`          | Error state styling                  |
| `errorMessage`          | `string`                   | `undefined`      | Error message to display             |
| `showInput`             | `boolean`                  | `true`           | Show/hide the input field            |
| `showFarDates`          | `boolean`                  | `true`           | Show dates from previous/next months |
| `minDate`               | `Date`                     | `undefined`      | Minimum selectable date              |
| `maxDate`               | `Date`                     | `undefined`      | Maximum selectable date              |
| `isArrowShown`          | `boolean`                  | `true`           | Show/hide dropdown arrow             |
| `arrowColor`            | `string`                   | `"rgba(...)"`    | Arrow icon color                     |
| `arrowSize`             | `number`                   | `12`             | Arrow icon size                      |
| `customArrowRotation`   | `number`                   | `0`              | Arrow rotation angle when open       |
| `customArrowIcon`       | `React.ReactNode`          | `undefined`      | Custom arrow icon component          |
| `customHeader`          | `React.ReactNode`          | `undefined`      | Custom header component              |
| `customFooter`          | `React.ReactNode`          | `undefined`      | Custom footer component              |
| `onDatePickerOpened`    | `() => void`               | `undefined`      | Callback when picker opens           |
| `onDatePickerClosed`    | `() => void`               | `undefined`      | Callback when picker closes          |
| `cancelButtonText`      | `string`                   | `"Cancel"`       | Cancel button text                   |
| `chooseDateButtonText`  | `string`                   | `"Choose date"`  | Confirm button text                  |
| `chooseYearButtonText`  | `string`                   | `"Choose year"`  | Year selection button text           |
| `chooseMonthButtonText` | `string`                   | `"Choose month"` | Month selection button text          |
| `onSlideChange`         | `(newSlide: Date) => void` | `undefined`      | Callback when slide changes          |

### Color Customization Props

| Prop                        | Type     | Default              | Description                          |
| --------------------------- | -------- | -------------------- | ------------------------------------ |
| `activeDateTextColor`       | `string` | `"#fff"`             | Text color for selected date         |
| `activeDateBackgroundColor` | `string` | `"#333"`             | Background color for selected date   |
| `dateTextColor`             | `string` | `"#333"`             | Text color for regular dates         |
| `dateBackgroundColor`       | `string` | `"transparent"`      | Background color for regular dates   |
| `farDateTextColor`          | `string` | `"rgba(0,0,0,.25)"`  | Text color for prev/next month dates |
| `farDateBackgroundColor`    | `string` | `"transparent"`      | Background for prev/next month dates |
| `rangeDateTextColor`        | `string` | `"#333"`             | Text color for dates in range        |
| `rangeDateBackgroundColor`  | `string` | `"rgba(0,0,0,.075)"` | Background color for dates in range  |
| `disabledDateTextColor`     | `string` | `"rgba(0,0,0,.25)"`  | Text color for disabled dates        |

### Style Props

| Prop                  | Type                   | Default     | Description                        |
| --------------------- | ---------------------- | ----------- | ---------------------------------- |
| `containerStyle`      | `StyleProp<ViewStyle>` | `undefined` | Container style                    |
| `inputContainerStyle` | `StyleProp<ViewStyle>` | `undefined` | Input container style              |
| `labelStyle`          | `StyleProp<TextStyle>` | `undefined` | Label text style                   |
| `placeholderStyle`    | `StyleProp<TextStyle>` | `undefined` | Placeholder text style             |
| `errorMessageStyle`   | `StyleProp<TextStyle>` | `undefined` | Error message text style           |
| `arrowContainerStyle` | `StyleProp<ViewStyle>` | `undefined` | Arrow container style              |
| `dateCellStyle`       | `StyleProp<ViewStyle>` | `undefined` | Date cell style                    |
| `startDateCellStyle`  | `StyleProp<ViewStyle>` | `undefined` | Start date cell style (range mode) |
| `endDateCellStyle`    | `StyleProp<ViewStyle>` | `undefined` | End date cell style (range mode)   |

### Button Props

| Prop                     | Type                           | Default     | Description               |
| ------------------------ | ------------------------------ | ----------- | ------------------------- |
| `cancelButtonProps`      | `Omit<ButtonProps, "onPress">` | `undefined` | Cancel button props       |
| `chooseDateButtonProps`  | `Omit<ButtonProps, "onPress">` | `undefined` | Choose date button props  |
| `chooseYearButtonProps`  | `Omit<ButtonProps, "onPress">` | `undefined` | Choose year button props  |
| `chooseMonthButtonProps` | `Omit<ButtonProps, "onPress">` | `undefined` | Choose month button props |

### Bottom Sheet Props

| Prop                    | Type                             | Default     | Description              |
| ----------------------- | -------------------------------- | ----------- | ------------------------ |
| `bottomSheetModalProps` | `Partial<BottomSheetModalProps>` | `undefined` | Bottom sheet modal props |

## 📖 Ref Methods

The component exposes the following methods via ref:

| Method               | Description                  |
| -------------------- | ---------------------------- |
| `open()`             | Opens the date picker modal  |
| `close()`            | Closes the date picker modal |
| `handleChooseDate()` | Confirms the selected date   |
| `swipeLeft()`        | Navigate to previous month   |
| `swipeRight()`       | Navigate to next month       |
| `changeYear()`       | Opens year selection modal   |

## 🎨 Advanced Examples

### Custom Colors

```tsx
<DatePicker
  mode="range"
  value={dateRange}
  onChange={setDateRange}
  activeDateBackgroundColor="#FF6B6B"
  activeDateTextColor="#FFFFFF"
  rangeDateBackgroundColor="#FFE0E0"
  rangeDateTextColor="#FF6B6B"
/>
```

### With Min/Max Dates

```tsx
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={new Date(2025, 11, 31)}
/>
```

### Custom Styling

```tsx
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  inputContainerStyle={{
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  }}
  dateCellStyle={{
    borderRadius: 12,
  }}
  startDateCellStyle={{
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  }}
  endDateCellStyle={{
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  }}
/>
```

### Without Input (Programmatic Control)

```tsx
const datePickerRef = useRef<DatePickerRef>(null);

<DatePicker
  ref={datePickerRef}
  mode="single"
  value={date}
  onChange={setDate}
  showInput={false}
/>

<Button onPress={() => datePickerRef.current?.open()}>
  Select Date
</Button>
```

## 🎯 Types

```typescript
type DateMode = "single" | "range";
type DateValue = Date | null;
type DateRangeValue = [Date | null, Date | null];

interface DatePickerRef {
  open: () => void;
  close: () => void;
  handleChooseDate: () => void;
  swipeRight: () => void;
  swipeLeft: () => void;
  changeYear: () => void;
}
```

## 📚 Contributing

Issues and pull requests are welcome! Please open an issue first to discuss major changes.

## 📄 License

MIT

---

Made with ❤️ by Dhia Ben Hamouda
