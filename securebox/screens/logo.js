import React, {useEffect} from 'react';
import {Image, View, BackHandler, Alert} from 'react-native';
import {GetLayoutSize, StatusBarHeight} from '../globalstyles';
import ExitIcon from './exitimg';
import SettingsIcon from './settingsico';

const LogoIcon = (props) => {
  const {noexit} = props;
  const exitShow = noexit || false;

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      {!exitShow ? <ExitIcon /> : <SettingsIcon />}
      <View
        style={{
          marginTop: StatusBarHeight(),
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Image
          style={{
            width: GetLayoutSize(20),
            height: GetLayoutSize(20),
          }}
          source={require('../assets/logo.png')}
        />
      </View>
    </>
  );
};

export default LogoIcon;
