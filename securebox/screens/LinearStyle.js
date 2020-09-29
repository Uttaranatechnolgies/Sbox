import React from 'react';
import {SafeAreaView} from 'react-native';
import {StatusBarHeight} from '../globalstyles';

const LinearStyle = ({children}) => {
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#fefefe',
          paddingTop: StatusBarHeight(),
        }}>
        {children}
      </SafeAreaView>
    </>
  );
};

export default LinearStyle;
