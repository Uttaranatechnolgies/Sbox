import React from 'react';
import {Image, View, BackHandler, TouchableOpacity} from 'react-native';
import {GetLayoutSize, GetWidth, StatusBarHeight} from '../globalstyles';

const ExitIcon = () => {
  const OnExitClicked = () => {
    BackHandler.exitApp();
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
          onPress={OnExitClicked}>
          <Image
            style={{
              width: GetLayoutSize(6),
              height: GetLayoutSize(6),
            }}
            source={require('../assets/exit.png')}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ExitIcon;
