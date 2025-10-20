import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// Types
export interface CustomInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?:
    | "outlined"
    | "filled"
    | "underlined"
    | "none"
    | "white"
    | "soft"
    | "bordered"
    | "ghost"
    | "elevated"
    | "tertiary";
  size?: "sm" | "base" | "lg";
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  showCharacterCount?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  rounded?: boolean;
  showNairaIcon?: boolean;
  formatAsNumber?: boolean; // New prop for number formatting
}

export interface CustomInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  getRawValue: () => string; // Get unformatted value
}

// Light mode colors based on your tailwind config
const COLORS = {
  primary: "#004bbd", // brand
  primaryDark: "#0065ff", // brand-dark
  primaryLight: "#b2e7ff", // brand-light
  text: "#08090a", // text.default
  textSubtle: "#3f3f40", // text.subtle
  textMuted: "#747575", // text.muted
  textHelper: "#515252", // text.helper
  textPlaceholder: "#a2a2a3", // text.placeholder
  textDisabled: "#d4d5d6", // text.disabled
  border: "#e4e5e6", // border.default
  borderMuted: "#a2a2a3", // border.muted
  borderSubtle: "#d4d5d6", // border.subtle
  background: "#ffffff", // background.default
  backgroundNeutral: "#f7f8fa", // background.neutral
  backgroundDisabled: "#f2f3f5", // background.disabled
  backgroundSoft: "#fafbfc", // very light background
  backgroundTertiary: "#EAF8FE", // tertiary light blue
  error: "#EB4131",
  shadow: "rgba(0, 0, 0, 0.08)", // for elevated variant
} as const;

// Size configurations based on your tailwind config
const SIZES = {
  sm: {
    height: 40,
    fontSize: 14, // text-sm
    padding: 12, // p-3
    iconSize: 16,
  },
  base: {
    height: 48,
    fontSize: 16, // text-base
    padding: 16, // p-4
    iconSize: 20,
  },
  lg: {
    height: 56,
    fontSize: 18, // text-lg
    padding: 20, // p-5
    iconSize: 24,
  },
} as const;

// Number formatting utilities
const formatNumber = (value: string): string => {
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, "");

  // Handle empty string
  if (!cleanValue) return "";

  // Split by decimal point
  const parts = cleanValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return with decimal part if it exists
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

const removeFormatting = (value: string): string => {
  return value.replace(/,/g, "");
};

const isValidNumber = (value: string): boolean => {
  if (!value) return true; // Empty string is valid
  const cleanValue = value.replace(/,/g, "");
  return /^\d*\.?\d*$/.test(cleanValue);
};

export const CustomInput = forwardRef<CustomInputRef, CustomInputProps>(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      variant = "outlined",
      size = "base",
      disabled = false,
      required = false,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      helperTextStyle,
      showCharacterCount = false,
      maxLength,
      multiline = false,
      numberOfLines = 1,
      value,
      onChangeText,
      onFocus,
      onBlur,
      rounded = false,
      showNairaIcon = false,
      formatAsNumber = false,
      ...textInputProps
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value || "");
    const [isFocused, setIsFocused] = useState(false);

    const inputValue = value !== undefined ? value : internalValue;
    const sizeConfig = SIZES[size];

    // Create naira icon component
    const nairaIcon = showNairaIcon ? (
      <Text
        style={{
          fontSize: sizeConfig.fontSize,
          fontWeight: "500",
          color: disabled ? COLORS.textDisabled : COLORS.text,
          fontFamily: "PoppinsRegular",
        }}
      >
        ₦
      </Text>
    ) : null;

    // Use naira icon as left icon if showNairaIcon is true and no custom leftIcon is provided
    const effectiveLeftIcon = showNairaIcon && !leftIcon ? nairaIcon : leftIcon;

    // Ref management
    const textInputRef = React.useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
      blur: () => textInputRef.current?.blur(),
      clear: () => {
        const newValue = "";
        setInternalValue(newValue);
        onChangeText?.(newValue);
      },
      getValue: () => inputValue,
      setValue: (newValue: string) => {
        const processedValue = formatAsNumber
          ? formatNumber(newValue)
          : newValue;
        setInternalValue(processedValue);
        onChangeText?.(processedValue);
      },
      getRawValue: () =>
        formatAsNumber ? removeFormatting(inputValue) : inputValue,
    }));

    // Event handlers
    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      if (formatAsNumber) {
        // Only proceed if it's a valid number format
        if (isValidNumber(text)) {
          const formattedText = formatNumber(text);
          setInternalValue(formattedText);
          onChangeText?.(formattedText);
        }
        // If invalid, don't update the value (ignore the input)
      } else {
        setInternalValue(text);
        onChangeText?.(text);
      }
    };

    // Style calculations
    const getBorderColor = () => {
      if (disabled) return COLORS.backgroundDisabled;
      if (error) return COLORS.error;
      if (isFocused) return COLORS.primary;
      return COLORS.border;
    };

    const getVariantStyles = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        height: multiline ? undefined : sizeConfig.height,
        minHeight: multiline
          ? sizeConfig.height * numberOfLines
          : sizeConfig.height,
        paddingHorizontal: sizeConfig.padding,
        paddingVertical: multiline ? 12 : 0, // p-3 for multiline
        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center",
      };

      switch (variant) {
        case "filled":
          return {
            ...baseStyle,
            backgroundColor: disabled
              ? COLORS.backgroundDisabled
              : COLORS.backgroundNeutral,
            borderRadius: rounded ? 50 : 8, // rounded-lg
            borderWidth: 0,
          };
        case "white":
          return {
            ...baseStyle,
            backgroundColor: disabled
              ? COLORS.backgroundDisabled
              : COLORS.background,
            borderRadius: rounded ? 50 : 8,
            borderWidth: 1,
            borderColor: getBorderColor(),
          };
        case "soft":
          return {
            ...baseStyle,
            backgroundColor: disabled
              ? COLORS.backgroundDisabled
              : COLORS.backgroundSoft,
            borderRadius: rounded ? 50 : 12, // slightly more rounded
            borderWidth: 0,
          };
        case "bordered":
          return {
            ...baseStyle,
            backgroundColor: "transparent",
            borderWidth: 2, // thicker border
            borderColor: getBorderColor(),
            borderRadius: rounded ? 50 : 8,
          };
        case "ghost":
          return {
            ...baseStyle,
            backgroundColor:
              isFocused || inputValue ? COLORS.backgroundSoft : "transparent",
            borderWidth: 1,
            borderColor:
              isFocused || inputValue ? getBorderColor() : "transparent",
            borderRadius: rounded ? 50 : 8,
          };
        case "elevated":
          return {
            ...baseStyle,
            backgroundColor: disabled
              ? COLORS.backgroundDisabled
              : COLORS.background,
            borderRadius: rounded ? 50 : 12,
            borderWidth: 1,
            borderColor: COLORS.borderSubtle,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 3, // for Android
          };
        case "tertiary":
          return {
            ...baseStyle,
            backgroundColor: disabled
              ? COLORS.backgroundDisabled
              : COLORS.backgroundTertiary,
            borderRadius: rounded ? 50 : 8,
            borderWidth: 0,
          };
        case "underlined":
          return {
            ...baseStyle,
            backgroundColor: "transparent",
            borderBottomWidth: 2,
            borderBottomColor: getBorderColor(),
            borderRadius: 0,
            paddingHorizontal: 0,
          };
        case "none":
          return {
            ...baseStyle,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderRadius: 0,
            paddingHorizontal: 0,
          };
        case "outlined":
        default:
          return {
            ...baseStyle,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: getBorderColor(),
            borderRadius: rounded ? 50 : 8, // rounded-lg
          };
      }
    };

    return (
      <View style={[{ marginVertical: 8 }, containerStyle]}>
        {/* Label */}
        {label && (
          <Text
            style={[
              {
                fontSize: 16, // text-sm
                fontWeight: "600", // font-semibold
                color: disabled ? COLORS.textDisabled : COLORS.text,
                marginBottom: 6, // mb-1.5
                fontFamily: "PoppinsBlack",
              },
              labelStyle,
            ]}
          >
            {label}
            {required && <Text style={{ color: COLORS.error }}> *</Text>}
          </Text>
        )}

        {/* Input Container */}
        <View style={getVariantStyles()}>
          {/* Left Icon */}
          {effectiveLeftIcon && (
            <View
              style={{
                position: "absolute",
                left: variant === "none" ? 0 : 12, // No padding for none variant
                zIndex: 10,
                width: sizeConfig.iconSize,
                height: sizeConfig.iconSize,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {effectiveLeftIcon}
            </View>
          )}

          {/* Text Input */}
          <TextInput
            ref={textInputRef}
            style={[
              {
                flex: 1,
                fontSize: sizeConfig.fontSize,
                paddingLeft: effectiveLeftIcon
                  ? variant === "none"
                    ? 26
                    : 26
                  : 0,
                paddingRight: rightIcon ? (variant === "none" ? 26 : 26) : 0,
                color: disabled ? COLORS.textDisabled : COLORS.text,
                textAlignVertical: multiline ? "top" : "center",
                fontFamily: "PoppinsRegular",
                includeFontPadding: false,
              },
              inputStyle,
            ]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textPlaceholder}
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardAppearance="light"
            keyboardType={
              formatAsNumber ? "numeric" : textInputProps.keyboardType
            }
            {...textInputProps}
          />

          {/* Right Icon */}
          {rightIcon && (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: variant === "none" ? 0 : 12, // No padding for none variant
                zIndex: 10,
                width: sizeConfig.iconSize,
                height: sizeConfig.iconSize,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={onRightIconPress}
              disabled={disabled}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 4, // mt-1
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Error Message */}
            {error && (
              <Text
                style={[
                  {
                    fontSize: 12, // text-xs
                    color: COLORS.error,
                    marginTop: 2, // mt-0.5
                    fontFamily: "PoppinsRegular",
                  },
                  errorStyle,
                ]}
              >
                {error}
              </Text>
            )}

            {/* Helper Text */}
            {helperText && !error && (
              <Text
                style={[
                  {
                    fontSize: 12, // text-xs
                    color: COLORS.textHelper,
                    marginTop: 2, // mt-0.5
                    fontFamily: "PoppinsRegular",
                  },
                  helperTextStyle,
                ]}
              >
                {helperText}
              </Text>
            )}
          </View>

          {/* Character Count */}
          {showCharacterCount && maxLength && (
            <Text
              style={{
                fontSize: 12, // text-xs
                color: COLORS.textMuted,
                marginTop: 2, // mt-0.5
                marginLeft: 8, // ml-2
                fontFamily: "PoppinsRegular",
              }}
            >
              {inputValue.length}/{maxLength}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
