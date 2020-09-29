import React from 'react';
import {StatusBar, Platform, Dimensions, PixelRatio} from 'react-native';

const {width, height, fontScale} = Dimensions.get('window');

const scale = width / 320;

const StatusBarHeight = () => {
  if (Platform.OS === 'ios') return 0;
  let barHeight = StatusBar.currentHeight;
  let part1 = 30 - barHeight;
  return part1 + barHeight;
};

const GradientColors = () => {
  return ['#31186C', '#2F8EAE', '#2EB4C0'];
};

const GetWidth = () => {
  return width;
};

const GetHeight = () => {
  return height;
};

const GetFontSize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const GetLayoutSize = (val) => {
  //console.log('LayouSize:' + Math.round(val * PixelRatio.get()));
  return Math.round(val * PixelRatio.get());
  //return PixelRatio.getPixelSizeForLayoutSize(val);
};

const GetWdithPercent = (val) => {
  return Math.round(width * (val / 100));
};

const GetHeightPercent = (val) => {
  return Math.round(height * (val / 100));
};

export {
  StatusBarHeight,
  GradientColors,
  GetFontSize,
  GetLayoutSize,
  GetWdithPercent,
  GetHeightPercent,
  GetWidth,
  GetHeight,
};
