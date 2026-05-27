import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
} from 'react-native'
import { withAppFont } from '../theme/typography'

export function Text(props: TextProps) {
  return <RNText {...props} style={withAppFont(props.style)} />
}

export function TextInput(props: TextInputProps) {
  return <RNTextInput {...props} style={withAppFont(props.style)} />
}
