/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from 'react-native';
import DropDownPicker, { DropDownPickerProps } from 'react-native-dropdown-picker';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type DropDownPickerThemedProps = ThemeProps & DropDownPickerProps<any>;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextProps & DefaultTextInput['props']) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultTextInput style={[{ color, backgroundColor }, style]} {...otherProps} />;
}

export function ThemedDropDownPicker(props: DropDownPickerThemedProps) {
  const { lightColor, darkColor, style, dropDownContainerStyle, textStyle, labelStyle, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DropDownPicker
      style={[{ backgroundColor }, style]}
      dropDownContainerStyle={[{ backgroundColor }, dropDownContainerStyle]}
      textStyle={[{ color: textColor }, textStyle]}
      labelStyle={[{ color: textColor }, labelStyle]}
      {...otherProps}
    />
  );
}

