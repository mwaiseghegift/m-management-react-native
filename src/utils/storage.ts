import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom Storage utility that uses SecureStore on mobile 
 * and falls back to AsyncStorage on web.
 */
export const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
  clear: async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.clear();
    } else {
      // SecureStore doesn't have a clear all, so we remove known keys
      const keys = ['access_token', 'refresh_token', 'user_profile'];
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    }
  }
};
