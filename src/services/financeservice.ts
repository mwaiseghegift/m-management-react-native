import {
    Bill,
    CategoryBreakdown,
    DailyAllowance,
    Debt,
    FinanceSummary,
    PaginatedResponse,
    Transaction,
    Wishlist
} from '@/types/financeManager';
import apiClient from './apiClient';
import { apiEndpoints } from './apis';

export const financeService = {
  analytics: {
    getSummary: () => apiClient.get<FinanceSummary>(apiEndpoints.financeManager.analytics.summary),
    getCategories: () => apiClient.get<CategoryBreakdown[]>(apiEndpoints.financeManager.analytics.categories),
    getDailyAllowance: () => apiClient.get<DailyAllowance>(apiEndpoints.financeManager.analytics.dailyAllowance),
  },
  bills: {
    list: (page = 1) => apiClient.get<PaginatedResponse<Bill>>(apiEndpoints.financeManager.bills.list, { params: { page } }),
    create: (data: Partial<Bill>) => apiClient.post<Bill>(apiEndpoints.financeManager.bills.create, data),
    pay: (id: string) => apiClient.post<Bill>(apiEndpoints.financeManager.bills.pay(id), {}),
  },
  debts: {
    list: (page = 1) => apiClient.get<PaginatedResponse<Debt>>(apiEndpoints.financeManager.debts.list, { params: { page } }),
    create: (data: Partial<Debt>) => apiClient.post<Debt>(apiEndpoints.financeManager.debts.create, data),
    nudge: (id: string) => apiClient.get<Debt>(apiEndpoints.financeManager.debts.nudge(id)),
  },
  transactions: {
    list: (page = 1) => apiClient.get<PaginatedResponse<Transaction>>(apiEndpoints.financeManager.transactions.list, { params: { page } }),
    create: (data: Partial<Transaction>) => apiClient.post<Transaction>(apiEndpoints.financeManager.transactions.create, data),
  },
  wishlist: {
    list: (page = 1) => apiClient.get<PaginatedResponse<Wishlist>>(apiEndpoints.financeManager.wishlist.list, { params: { page } }),
    create: (data: Partial<Wishlist>) => apiClient.post<Wishlist>(apiEndpoints.financeManager.wishlist.create, data),
  },
};


