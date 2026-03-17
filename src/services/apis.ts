// import { Platform } from 'react-native';
// import Constants from 'expo-constants';

// // For physical devices or iOS simulators, we can try to get the host IP from Expo Constants
// const debuggerHost = Constants.expoConfig?.hostUri;
// const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

// export const API_BASE_URL = Platform.select({
//   android: 'http://10.0.2.2:8000/api', // Standard Android emulator loopback
//   ios: `http://${localhost}:8000/api`,
//   web: 'http://localhost:8000/api',
//   default: `http://${localhost}:8000/api`,
// }) || 'http://localhost:8000/api';

export const API_BASE_URL = 'https://mwaisegheware.com/api';

export const apiEndpoints = {
  auth: {
    login: '/auth/login/',
    refresh: '/auth/token/refresh/',
    verify: '/auth/token/verify/',
    register: '/auth/register/',
  },
  financeManager: {
    analytics: {
      categories: '/finance-manager/analytics/categories/',
      dailyAllowance: '/finance-manager/analytics/daily-allowance/',
      summary: '/finance-manager/analytics/summary/',
    },
    bills: {
      list: '/finance-manager/bills/',
      create: '/finance-manager/bills/',
      retrieve: (id: string) => `/finance-manager/bills/${id}/`,
      update: (id: string) => `/finance-manager/bills/${id}/`,
      partialUpdate: (id: string) => `/finance-manager/bills/${id}/`,
      destroy: (id: string) => `/finance-manager/bills/${id}/`,
      pay: (id: string) => `/finance-manager/bills/${id}/pay/`,
    },
    debts: {
      list: '/finance-manager/debts/',
      create: '/finance-manager/debts/',
      retrieve: (id: string) => `/finance-manager/debts/${id}/`,
      update: (id: string) => `/finance-manager/debts/${id}/`,
      partialUpdate: (id: string) => `/finance-manager/debts/${id}/`,
      destroy: (id: string) => `/finance-manager/debts/${id}/`,
      nudge: (id: string) => `/finance-manager/debts/${id}/nudge/`,
    },
    transactions: {
      list: '/finance-manager/transactions/',
      create: '/finance-manager/transactions/',
      retrieve: (id: string) => `/finance-manager/transactions/${id}/`,
      update: (id: string) => `/finance-manager/transactions/${id}/`,
      partialUpdate: (id: string) => `/finance-manager/transactions/${id}/`,
      destroy: (id: string) => `/finance-manager/transactions/${id}/`,
    },
    wishlist: {
      list: '/finance-manager/wishlist/',
      create: '/finance-manager/wishlist/',
      retrieve: (id: string) => `/finance-manager/wishlist/${id}/`,
      update: (id: string) => `/finance-manager/wishlist/${id}/`,
      partialUpdate: (id: string) => `/finance-manager/wishlist/${id}/`,
      destroy: (id: string) => `/finance-manager/wishlist/${id}/`,
      buy: (id: string) => `/finance-manager/wishlist/${id}/buy/`,
    },
  },
};
