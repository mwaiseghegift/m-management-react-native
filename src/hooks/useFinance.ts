import { useState, useEffect, useCallback } from 'react';
import { financeService } from '@/services/financeservice';
import {
  Transaction,
  Debt,
  Wishlist,
  Bill,
  FinanceSummary,
  DailyAllowance,
} from '@/types/financeManager';

// ─── Generic fetch hook ───────────────────────────────────────────────────────
export function useFetch<T>(fetcher: () => Promise<{ data: T }>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── Dashboard (Home) hook ────────────────────────────────────────────────────
export function useDashboard() {
  const summary = useFetch<FinanceSummary>(() => financeService.analytics.getSummary());
  const allowance = useFetch<DailyAllowance>(() => financeService.analytics.getDailyAllowance());
  const transactions = useFetch<{ count: number; results: Transaction[] }>(
    () => financeService.transactions.list(1)
  );

  const refetchAll = useCallback(() => {
    summary.refetch();
    allowance.refetch();
    transactions.refetch();
  }, [summary.refetch, allowance.refetch, transactions.refetch]);

  return { summary, allowance, transactions, refetchAll };
}

// ─── Transactions hook ────────────────────────────────────────────────────────
export function useTransactions() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch<{ count: number; results: Transaction[] }>(
    () => financeService.transactions.list(page),
    [page]
  );

  return {
    transactions: data?.results ?? [],
    count: data?.count ?? 0,
    loading,
    error,
    page,
    setPage,
    refetch,
  };
}

// ─── Debts hook ───────────────────────────────────────────────────────────────
export function useDebts() {
  const { data, loading, error, refetch } = useFetch<{ count: number; results: Debt[] }>(
    () => financeService.debts.list(1)
  );

  const debts = data?.results ?? [];
  const iOwe = debts
    .filter((d) => d.direction === 'BORROWED' && d.status !== 'SETTLED')
    .reduce((acc, d) => acc + d.amount, 0);
  const owedToMe = debts
    .filter((d) => d.direction === 'LENT' && d.status !== 'SETTLED')
    .reduce((acc, d) => acc + d.amount, 0);

  return { debts, iOwe, owedToMe, count: data?.count ?? 0, loading, error, refetch };
}

// ─── Wishlist hook ────────────────────────────────────────────────────────────
export function useWishlist() {
  const { data, loading, error, refetch } = useFetch<{ count: number; results: Wishlist[] }>(
    () => financeService.wishlist.list(1)
  );

  const items = data?.results ?? [];
  const coolItems = items.filter((i) => i.is_cool && !i.is_purchased);
  const waitingItems = items.filter((i) => !i.is_cool && !i.is_purchased);

  return {
    items,
    coolItems,
    waitingItems,
    count: data?.count ?? 0,
    loading,
    error,
    refetch,
  };
}

// ─── Bills hook ───────────────────────────────────────────────────────────────
export function useBills() {
  const { data, loading, error, refetch } = useFetch<{ count: number; results: Bill[] }>(
    () => financeService.bills.list(1)
  );

  const bills = data?.results ?? [];
  const now = new Date();

  // "due this month" = bills whose due_day is still upcoming in the current month
  const dueThisMonth = bills
    .filter((b) => b.due_day >= now.getDate())
    .reduce((acc, b) => acc + b.amount, 0);

  // "paid" = bills with last_paid_date in the current month
  const paidThisMonth = bills.filter((b) => {
    if (!b.last_paid_date) return false;
    const d = new Date(b.last_paid_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // overdue = past due_day, no last_paid_date this month
  const overdue = bills.filter((b) => {
    if (b.due_day < now.getDate()) {
      if (!b.last_paid_date) return true;
      const d = new Date(b.last_paid_date);
      return !(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear());
    }
    return false;
  });

  return {
    bills,
    dueThisMonth,
    paidThisMonth: paidThisMonth.reduce((acc, b) => acc + b.amount, 0),
    overdueCount: overdue.length,
    count: data?.count ?? 0,
    loading,
    error,
    refetch,
  };
}
