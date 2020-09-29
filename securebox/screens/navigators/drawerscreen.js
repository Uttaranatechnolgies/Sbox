import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import OrderScreen from '../orders/orderscreen';
import OrderDetailsScreen from '../orders/orderdscreen';
import BarcodeScreen from '../orders/scanscreen';
import NewOrderScreen from '../orders/ordernscreen';
import UnlockScreen from '../orders/orderunlock';
import UnlockOTPScreen from '../orders/orderunlockotp';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator initialRouteName="Order">
      <Drawer.Screen name="Order" component={OrderScreen} />
      <Drawer.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Drawer.Screen name="Scan" component={BarcodeScreen} />
      <Drawer.Screen name="NewOrder" component={NewOrderScreen} />
    </Drawer.Navigator>
  );
};

const Stack = createStackNavigator();

const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Order"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="NewOrder" component={NewOrderScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Scan" component={BarcodeScreen} />
      <Stack.Screen name="Unlock" component={UnlockScreen} />
      <Stack.Screen name="UnlockOTP" component={UnlockOTPScreen} />
    </Stack.Navigator>
  );
};

export default StackScreen;
