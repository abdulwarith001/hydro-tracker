import arrowdown from "@/assets/icons/arrowdown.png";
import cancel from "@/assets/icons/cancel-times.png";
import search from "@/assets/icons/search.png";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?:
    | "outlined"
    | "filled"
    | "underlined"
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
  selectStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  options: SelectOption[];
  value?: string | number;
  onSelectionChange?: (option: SelectOption) => void;
  multiple?: boolean;
  multipleValues?: (string | number)[];
  onMultipleSelectionChange?: (options: SelectOption[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalTitle?: string;
  emptyText?: string;
  maxHeight?: number;
  closeOnSelect?: boolean;
  rounded?: boolean;
}

export interface CustomSelectRef {
  open: () => void;
  close: () => void;
  clear: () => void;
  getValue: () => SelectOption | SelectOption[] | null;
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
  backgroundOverlay: "#0d0d0d3d", // background.overlay
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

// Chevron Down Icon Component
const ChevronDownIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.6, color, fontWeight: "bold" }}>⌄</Text>
  </View>
);

// Search Icon Component
const SearchIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>🔍</Text>
  </View>
);

// Check Icon Component
const CheckIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.7, color, fontWeight: "bold" }}>✓</Text>
  </View>
);

export const CustomSelect = forwardRef<CustomSelectRef, CustomSelectProps>(
  (
    {
      label,
      placeholder = "Select an option",
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "outlined",
      size = "base",
      disabled = false,
      required = false,
      containerStyle,
      selectStyle,
      labelStyle,
      errorStyle,
      helperTextStyle,
      options = [],
      value,
      onSelectionChange,
      multiple = false,
      multipleValues = [],
      onMultipleSelectionChange,
      searchable = true,
      searchPlaceholder = "Search options...",
      modalTitle = "Select Options",
      emptyText = "No options available",
      closeOnSelect = true,
      rounded = false,
    },
    ref
  ) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalAnimation] = useState(new Animated.Value(0));

    const insets = useSafeAreaInsets();
    const sizeConfig = SIZES[size];
    const screenHeight = Dimensions.get("window").height;

    // Get selected options
    const selectedOptions = useMemo(() => {
      if (multiple) {
        return options.filter((option) =>
          multipleValues.includes(option.value)
        );
      } else {
        return options.find((option) => option.value === value);
      }
    }, [options, value, multipleValues, multiple]);

    // Filter options based on search
    const filteredOptions = useMemo(() => {
      if (!searchQuery.trim()) return options;
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    // Ref management
    useImperativeHandle(ref, () => ({
      open: () => openModal(),
      close: () => closeModal(),
      clear: () => {
        if (multiple) {
          onMultipleSelectionChange?.([]);
        } else {
          onSelectionChange?.(null as any);
        }
      },
      getValue: () => selectedOptions as any,
    }));

    const openModal = () => {
      setIsModalVisible(true);
      setSearchQuery("");
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    };

    const closeModal = () => {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsModalVisible(false);
      });
    };

    const handleOptionSelect = (option: SelectOption) => {
      if (option.disabled) return;

      if (multiple) {
        const isSelected = multipleValues.includes(option.value);
        const newValues = isSelected
          ? multipleValues.filter((val) => val !== option.value)
          : [...multipleValues, option.value];

        const newSelectedOptions = options.filter((opt) =>
          newValues.includes(opt.value)
        );
        onMultipleSelectionChange?.(newSelectedOptions);
      } else {
        onSelectionChange?.(option);
        if (closeOnSelect) {
          closeModal();
        }
      }
    };

    // Style calculations
    const getBorderColor = () => {
      if (disabled) return COLORS.backgroundDisabled;
      if (error) return COLORS.error;
      return COLORS.border;
    };

    const getVariantStyles = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        height: sizeConfig.height,
        paddingHorizontal: sizeConfig.padding,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "transparent",
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
        case "outlined":
        default:
          return {
            ...baseStyle,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: getBorderColor(),
            borderRadius: rounded ? 50 : 8,
          };
      }
    };

    const getDisplayText = () => {
      if (multiple) {
        const count = multipleValues.length;
        if (count === 0) return placeholder;
        if (count === 1) {
          const option = options.find((opt) => opt.value === multipleValues[0]);
          return option?.label || placeholder;
        }
        return `${count} items selected`;
      } else {
        const option = options.find((opt) => opt.value === value);
        return option?.label || placeholder;
      }
    };

    const hasSelection = multiple
      ? multipleValues.length > 0
      : value !== undefined && value !== null;

    const renderOption = ({ item }: { item: SelectOption }) => {
      const isSelected = multiple
        ? multipleValues.includes(item.value)
        : value === item.value;

      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: isSelected
              ? COLORS.primaryLight + "30"
              : "transparent",
            borderBottomWidth: 0.5,
            borderBottomColor: COLORS.border,
            opacity: item.disabled ? 0.5 : 1,
          }}
          onPress={() => handleOptionSelect(item)}
          disabled={item.disabled}
        >
          {item.icon && (
            <View style={{ marginRight: 12, width: 24, alignItems: "center" }}>
              {item.icon}
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: item.disabled ? COLORS.textDisabled : COLORS.text,
                fontFamily: "PoppinsRegular",
                fontWeight: isSelected ? "600" : "400",
              }}
            >
              {item.label}
            </Text>
            {item.description && (
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textMuted,
                  fontFamily: "PoppinsRegular",
                  marginTop: 2,
                }}
              >
                {item.description}
              </Text>
            )}
          </View>

          {isSelected && (
            <View style={{ marginLeft: 12 }}>
              <CheckIcon size={20} color={COLORS.primary} />
            </View>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={[{ marginVertical: 8 }, containerStyle]}>
        {/* Label */}
        {label && (
          <Text
            style={[
              {
                fontSize: 16,
                fontWeight: "600",
                color: disabled ? COLORS.textDisabled : COLORS.text,
                marginBottom: 6,
                fontFamily: "PoppinsBlack",
              },
              labelStyle,
            ]}
          >
            {label}
            {required && <Text style={{ color: COLORS.error }}> *</Text>}
          </Text>
        )}

        {/* Select Trigger */}
        <TouchableOpacity
          style={getVariantStyles()}
          onPress={openModal}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {/* Left Icon */}
            {leftIcon && (
              <View
                style={{
                  marginRight: 12,
                  width: sizeConfig.iconSize,
                  alignItems: "center",
                }}
              >
                {leftIcon}
              </View>
            )}

            {/* Display Text */}
            <Text
              style={[
                {
                  flex: 1,
                  fontSize: sizeConfig.fontSize,
                  color: hasSelection
                    ? disabled
                      ? COLORS.textDisabled
                      : COLORS.text
                    : COLORS.textPlaceholder,
                  fontFamily: "PoppinsRegular",
                },
                selectStyle,
              ]}
              numberOfLines={1}
            >
              {getDisplayText()}
            </Text>
          </View>

          {/* Right Icon */}
          <View style={{ marginLeft: 12 }}>
            {rightIcon || <Image source={arrowdown} />}
          </View>
        </TouchableOpacity>

        {/* Bottom Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 4,
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Error Message */}
            {error && (
              <Text
                style={[
                  {
                    fontSize: 12,
                    color: COLORS.error,
                    marginTop: 2,
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
                    fontSize: 12,
                    color: COLORS.textHelper,
                    marginTop: 2,
                    fontFamily: "PoppinsRegular",
                  },
                  helperTextStyle,
                ]}
              >
                {helperText}
              </Text>
            )}
          </View>
        </View>

        {/* Modal */}
        <Modal
          visible={isModalVisible}
          transparent={false} // full screen, no dim overlay
          animationType="slide"
          presentationStyle="formSheet"
          onRequestClose={closeModal}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: COLORS.background,
              transform: [
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.98, 1],
                  }),
                },
              ],
              opacity: modalAnimation,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: COLORS.text,
                  fontFamily: "PoppinsSemiBold",
                }}
              >
                {modalTitle}
              </Text>

              <TouchableOpacity
                onPress={closeModal}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  backgroundColor: COLORS.backgroundNeutral,
                }}
              >
                <Image source={cancel} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            {searchable && (
              <View
                style={{
                  padding: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.backgroundNeutral,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 40,
                  }}
                >
                  <Image source={search} className="w-5 h-5" />
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 8,
                      fontSize: 16,
                      color: COLORS.text,
                      fontFamily: "PoppinsRegular",
                    }}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={COLORS.textPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    keyboardAppearance="light"
                  />
                </View>
              </View>
            )}

            {/* Options List */}
            <View style={{ flex: 1, marginTop: 10 }}>
              {filteredOptions.length > 0 ? (
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={renderOption}
                />
              ) : (
                <View
                  style={{
                    padding: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.textMuted,
                      textAlign: "center",
                      fontFamily: "PoppinsRegular",
                    }}
                  >
                    {searchQuery.trim()
                      ? "No matching options found"
                      : emptyText}
                  </Text>
                </View>
              )}
            </View>

            {/* Footer for multiple selection */}
            {multiple && multipleValues.length > 0 && (
              <View
                style={{
                  padding: 16,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.border,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.textMuted,
                    fontFamily: "PoppinsRegular",
                  }}
                >
                  {multipleValues.length} item
                  {multipleValues.length !== 1 ? "s" : ""} selected
                </Text>

                <TouchableOpacity
                  onPress={closeModal}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: "600",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Modal>
      </View>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;
