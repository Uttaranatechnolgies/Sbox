
import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

import {GetFontSize} from '../../globalstyles';

export const CustomButton = (props) => {
  const {title, type, onPress, style = {}} = props;
  const btnType = type || 'nofill';

  const getStyle = () => {
    return btnType === 'fill' ? styles.filledButton : styles.outlineButton;
  };

  const getButtonStyle = () => {
    return btnType === 'fill' ? styles.filledText : styles.outlineText;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, getStyle(), style]}>
      <Text style={[styles.buttonText, getButtonStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: '100%',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'black',
  },

  outlineButton: {
    backgroundColor: '#ffffff',
    borderColor: '#d4202a',
    borderWidth: 1,
  },

  filledButton: {
    backgroundColor: '#1c2449',
    borderColor: '#1c2449',
    borderWidth: 1,
    color: '#fefefe',
    fontWeight: 'bold',
  },

  outlineText: {
    fontSize: GetFontSize(16),
    color: '#d4202a',
    fontWeight: 'bold',
  },

  filledText: {
    fontSize: GetFontSize(14),
    color: '#fefefe',
    fontWeight: 'bold',
  },
});

export default {CustomButton};
