import React, { useContext } from 'react'
import { Text, Dimensions } from 'react-native'
import { ThemeContext, Colors } from '../Context/ThemeContext'
import { fontSize as FS } from '../Constants/Dimensions';

const { fontScale } = Dimensions.get('window')
const fontSize = {
  popupHeaderText: { fontSize: fontScale * 20, fontWeight: 'bold' },
  popupBodyText: { fontSize: fontScale * 16 },
  headerText: { fontSize: FS * 0.6, fontWeight: 'bold' },
  freeText: { fontSize: fontScale * 16 },
  freeTextInvert: { fontSize: fontScale * 16 },
  buttonText: { fontSize: fontScale * 20, fontWeight: 'bold' },
  primaryButtonText: { fontSize: FS * 0.75, fontWeight: 'bold' },
  secondaryButtonText: { fontSize: FS * 0.6, fontWeight: 'bold' },
  errorMessage: { fontSize: fontScale * 15 },
  subHeader: { fontSize: fontScale * 14 },
  link: { fontSize: fontScale * 17 },
  input: { fontSize: fontScale * 17 },
  paginationOn: { fontSize: fontScale * 17.5 },
  paginationOff: { fontSize: fontScale * 17.5 },
}

export default ThemeText = ({ type, style, onPress, children, ...rest }) => {
  const { theme } = useContext(ThemeContext);
  const colors = {
    popupHeaderText: { color: theme.secondaryColor },
    popupBodyText: { color: theme.primaryColor },
    headerText: { color: theme.freeTextColor },
    freeText: { color: theme.freeTextColor },
    freeTextInvert: { color: theme.freeTextColorInvert },
    buttonText: { color: theme.buttonTextColor },
    primaryButtonText: { color: theme.primaryButtonText },
    secondaryButtonText: { color: theme.secondaryButtonText },
    errorMessage: { color: Colors.red },
    subHeader: { color: theme.highlight2 },
    link: { color: Colors.blue, textDecorationLine: 'underline' },
    input: { color: theme.text },
    paginationOn: { color: theme.text, textDecorationLine: 'underline', fontWeight: 'bold' },
    paginationOff: { color: theme.subtext },
  };

  return (
    <Text style={[fontSize[type], colors[type], style]} {...rest} onPress={onPress}>
      {children}
    </Text>
  );
}
