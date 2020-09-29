import React, {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {AuthContext} from './auth';
import {SetItem, GetItem, RemoveItem} from './sessions';
import SplashScreen from 'react-native-splash-screen';
import DrawerScreen from './screens/navigators/drawerscreen';
import StackScreen from './screens/navigators/stackscreen';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const App = () => {
  const initState = {
    userName: null,
    userToken: null,
    isLoading: true,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOADING':
        return {
          ...prevState,
          isLoading: action.status,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initState);

  const authContext = React.useMemo(
    () => ({
      onProgessBar: async ({barStatus}) => {
        dispatch({type: 'LOADING', status: barStatus});
      },
      signIn: async ({user, token}) => {
        try {
          await SetItem('userToken', token);
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGIN', id: user, token: token});
      },
      signOut: async () => {
        try {
          await RemoveItem('userToken');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      await RemoveItem('userToken');
      let userToken;
      userToken = null;
      try {
        userToken = await GetItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(0, 0, 0, 0)"
      />
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={appTheme}>
          {loginState.userToken !== null ? <DrawerScreen /> : <StackScreen />}
        </NavigationContainer>
      </AuthContext.Provider>
    </>
  );
};

export default App;
