import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTransactions } from '@/hooks/useFinance';
import { Transaction } from '@/types/financeManager';

type FilterType = 'all' | 'INC' | 'EXP';

const fmt = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}k` : `KES ${n.toLocaleString()}`;

function FilterPill({
  label, active, color, onPress,
}: { label: string; active: boolean; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
      backgroundColor: active ? color + '25' : Colors.bgCard,
      borderWidth: 1, borderColor: active ? color + '60' : Colors.border, marginRight: 8,
    }}>
      <Text style={{ color: active ? color : Colors.textMuted, fontSize: 13, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.transaction_type === 'INC';
  const color = isIncome ? Colors.successText : Colors.dangerText;
  const bg = isIncome ? Colors.successBg : Colors.dangerBg;
  const date = new Date(tx.transaction_date);
  const dateStr = date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    }}>
      <View style={{
        width: 42, height: 42, borderRadius: 13, backgroundColor: bg,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
        borderWidth: 1, borderColor: color + '30',
      }}>
        <Ionicons name={isIncome ? 'arrow-up' : 'arrow-down'} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
          {tx.category}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
          {tx.payment_method} · {dateStr}
        </Text>
        {tx.description ? (
          <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 1 }} numberOfLines={1}>{tx.description}</Text>
        ) : null}
      </View>
      <Text style={{ color, fontSize: 15, fontWeight: '700' }}>
        {isIncome ? '+' : '-'}{fmt(tx.amount)}
      </Text>
    </View>
  );
}

export default function Transactions() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { transactions, count, loading, error, refetch } = useTransactions();

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.transaction_type === filter);

  const totalIncome = transactions.filter(t => t.transaction_type === 'INC').reduce((a, t) => a + t.amount, 0);
  const totalExpense = transactions.filter(t => t.transaction_type === 'EXP').reduce((a, t) => a + t.amount, 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgBase }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgBase} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.indigo} />}
      >
        {/* Header */}
        <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 48, paddingHorizontal: 24, paddingBottom: 20 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            Finance Ledger
          </Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>
            Transactions
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
            {count > 0 ? `${count} record${count !== 1 ? 's' : ''} found` : 'Track every single cent.'}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Stats Row */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            {/* Income chip */}
            <View style={{ flex: 1, backgroundColor: Colors.successBg, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.successText + '30' }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.successText + '25', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Ionicons name="arrow-up" size={18} color={Colors.successText} />
              </View>
              <Text style={{ color: Colors.successText + 'AA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Income</Text>
              {loading ? <ActivityIndicator color={Colors.successText} size="small" /> : (
                <Text style={{ color: Colors.successText, fontSize: 20, fontWeight: '800' }}>{fmt(totalIncome)}</Text>
              )}
            </View>
            {/* Expense chip */}
            <View style={{ flex: 1, backgroundColor: Colors.dangerBg, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: Colors.dangerText + '30' }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.dangerText + '25', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Ionicons name="arrow-down" size={18} color={Colors.dangerText} />
              </View>
              <Text style={{ color: Colors.dangerText + 'AA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Expenses</Text>
              {loading ? <ActivityIndicator color={Colors.dangerText} size="small" /> : (
                <Text style={{ color: Colors.dangerText, fontSize: 20, fontWeight: '800' }}>{fmt(totalExpense)}</Text>
              )}
            </View>
          </View>

          {/* Net Flow Banner */}
          {!loading && (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 18, padding: 16,
              borderWidth: 1, borderColor: Colors.border, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
            }}>
              <View>
                <Text style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 2 }}>
                  Net Flow · {new Date().toLocaleString('default', { month: 'long' })}
                </Text>
                <Text style={{ color: totalIncome - totalExpense >= 0 ? Colors.successText : Colors.dangerText, fontSize: 22, fontWeight: '800' }}>
                  {totalIncome - totalExpense >= 0 ? '+' : ''}{fmt(totalIncome - totalExpense)}
                </Text>
              </View>
              <View style={{
                width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.successBg,
                alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.success + '40',
              }}>
                <Ionicons name={totalIncome >= totalExpense ? 'trending-up' : 'trending-down'} size={22} color={totalIncome >= totalExpense ? Colors.successText : Colors.dangerText} />
              </View>
            </View>
          )}

          {/* Filter Tabs */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="Income" active={filter === 'INC'} color={Colors.successText} onPress={() => setFilter('INC')} />
            <FilterPill label="Expense" active={filter === 'EXP'} color={Colors.dangerText} onPress={() => setFilter('EXP')} />
          </View>

          {/* Error state */}
          {error && (
            <View style={{ backgroundColor: Colors.dangerBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.danger + '40' }}>
              <Text style={{ color: Colors.dangerText, fontSize: 13 }}>{error}</Text>
            </View>
          )}

          {/* List / Empty state */}
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <ActivityIndicator color={Colors.indigo} size="large" />
              <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 12 }}>Loading transactions…</Text>
            </View>
          ) : filtered.length > 0 ? (
            <View style={{ backgroundColor: Colors.bgCard, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border }}>
              {filtered.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
            </View>
          ) : (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 20, padding: 36,
              alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
            }}>
              <View style={{
                width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bgSurface,
                alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight,
              }}>
                <Ionicons name="receipt-outline" size={28} color={Colors.textMuted} />
              </View>
              <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>No transactions yet</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                Log your first income or expense{'\n'}to build your financial ledger.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity activeOpacity={0.85} style={{
        position: 'absolute', bottom: Platform.OS === 'ios' ? 104 : 80, right: 24,
        width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.indigoDark,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.indigo, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8,
      }}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
