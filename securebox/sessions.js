import AsyncStorage from '@react-native-community/async-storage';

const SetItem = async (key, item) => {
  await AsyncStorage.setItem(key, item);
};

const GetItem = async (key) => {
  return await AsyncStorage.getItem(key);
};

const RemoveItem = async (key) => {
  return await AsyncStorage.removeItem(key);
};

export {SetItem, GetItem, RemoveItem};
