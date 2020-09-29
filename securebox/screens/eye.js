import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {GetLayoutSize, GetWidth, GetWdithPercent} from '../globalstyles';

const ExitIcon = (props) => {
  const {onPress, style = {}} = props;
  const [isEnabled, setEnabled] = useState(false);

  const OnEyeClicked = (e) => {
    e.preventDefault();
    setEnabled(!isEnabled);
    onPress(isEnabled);
  };

  return (
    <>
      <View style={[styles.eyeStyle, style]}>
        <TouchableOpacity
          style={{
            width: GetLayoutSize(10),
            height: GetLayoutSize(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={(event) => OnEyeClicked(event)}>
          {isEnabled ? (
            <Image
              style={{
                width: GetLayoutSize(6),
                height: GetLayoutSize(6),
              }}
              source={require('../assets/eye.png')}
            />
          ) : (
            <Image
              style={{
                width: GetLayoutSize(6),
                height: GetLayoutSize(6),
              }}
              source={require('../assets/eye-off.png')}
            />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  eyeStyle: {
    zIndex: 1000,
    position: 'absolute',
    bottom: 0,
    left: GetWdithPercent(70),
    right: 0,
    width: GetLayoutSize(6) < 30 ? 30 : GetLayoutSize(6),
    height: GetLayoutSize(6) < 30 ? 30 : GetLayoutSize(6),
  },
});

export default ExitIcon;
