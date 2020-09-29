import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MPinScreen from '../mpin/mpin';
import MNumberScreen from '../mpin/mnumber';
import MOTPScreen from '../mpin/motp';
import MNewPinScreen from '../mpin/mnpin';
import SettingScreen from '../settings';

const Stack = createStackNavigator();

const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="MPin"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MPin" component={MPinScreen} />
      <Stack.Screen name="MNumber" component={MNumberScreen} />
      <Stack.Screen name="MOTP" component={MOTPScreen} />
      <Stack.Screen name="MNewPIN" component={MNewPinScreen} />
      <Stack.Screen name="Settings" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default StackScreen;
