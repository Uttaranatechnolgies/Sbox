import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {GetLayoutSize, GetWidth, StatusBarHeight} from '../globalstyles';
import {useNavigation} from '@react-navigation/native';

const SettingsIcon = () => {
  const navigation = useNavigation();
  const OnSettingsClicked = (e) => {
    e.preventDefault();
    navigation.navigate('Settings');
  };
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: StatusBarHeight() + 15,
          bottom: 0,
          left: GetWidth() - GetLayoutSize(15),
          right: 0,
        }}>
        <TouchableOpacity
          style={{
            width: GetLayoutSize(10),
            height: GetLayoutSize(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={(event) => OnSettingsClicked(event)}>
          <Image
            style={{
              width: GetLayoutSize(6),
              height: GetLayoutSize(6),
            }}
            source={require('../assets/settings.png')}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SettingsIcon;
