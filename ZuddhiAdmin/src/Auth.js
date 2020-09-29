import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

const initialState = {
  userName: null,
  userToken: null,
  isLoading: true,
};

const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "LOGIN":
      return {
        ...prevState,
        userName: action.id,
        userToken: action.token,
        isLoading: false,
      };
    case "LOADING":
      return {
        ...prevState,
        isLoading: action.status,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...prevState,
        userName: null,
        userToken: null,
        isLoading: false,
      };
  }
};

const [loginState, dispatch] = React.useReducer(loginReducer, initialState);

const AuthContextValue = React.useMemo(
  () => ({
    onProgessBar: async ({ barStatus }) => {
      dispatch({ type: "LOADING", status: barStatus });
    },
    signIn: async ({ user, token }) => {
      try {
        await AsyncStorage.setItem("username", user);
        await AsyncStorage.setItem("userToken", token);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGIN", id: user, token: token });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },
  }),
  []
);

export default AuthContextValue;
