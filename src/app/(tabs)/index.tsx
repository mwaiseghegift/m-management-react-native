import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SummaryCard } from '@/components/ui/Card';
import { useDashboard } from '@/hooks/useFinance';
import { Transaction } from '@/types/financeManager';

const fmt = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}k` : `KES ${n.toLocaleString()}`;

// ─── Quick Action Button ─────────────────────────────────────────────────────
function QuickAction({
  icon,
  label,
  color,
  bg,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bg: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={{ alignItems: 'center', flex: 1 }}>
      <View style={{
        width: 56, height: 56, borderRadius: 18, backgroundColor: bg,
        alignItems: 'center', justifyContent: 'center', marginBottom: 8,
        borderWidth: 1, borderColor: color + '30',
      }}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={{ color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Budget Progress Bar ─────────────────────────────────────────────────────
function BudgetBar({ income, expense }: { income: number; expense: number }) {
  const pct = income > 0 ? Math.min(expense / income, 1) : 0;
  const barColor = pct > 0.85 ? Colors.danger : pct > 0.65 ? Colors.warning : Colors.indigo;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: pct, duration: 900, delay: 400, useNativeDriver: false,
    }).start();
  }, [pct]);

  const barWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={{
      backgroundColor: Colors.bgCard, borderRadius: 20, padding: 18,
      borderWidth: 1, borderColor: Colors.border, marginBottom: 20,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Monthly Budget
        </Text>
        <Text style={{ color: barColor, fontSize: 12, fontWeight: '700' }}>
          {Math.round(pct * 100)}% used
        </Text>
      </View>
      <View style={{ height: 8, backgroundColor: Colors.bgSurface, borderRadius: 8, overflow: 'hidden' }}>
        <Animated.View style={{ height: '100%', width: barWidth, backgroundColor: barColor, borderRadius: 8 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
          {fmt(expense)} spent
        </Text>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
          {fmt(Math.max(income - expense, 0))} left
        </Text>
      </View>
    </View>
  );
}

// ─── Hero Balance Card ────────────────────────────────────────────────────────
function HeroCard({
  fadeAnim,
  dailyAllowance,
  netFlow,
  activeDebt,
  loading,
}: {
  fadeAnim: Animated.Value;
  dailyAllowance: number;
  netFlow: number;
  activeDebt: number;
  loading: boolean;
}) {
  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
      marginBottom: 20,
    }}>
      <View style={{
        borderRadius: 28, overflow: 'hidden',
        backgroundColor: Colors.indigoDark, padding: 28,
        borderWidth: 1, borderColor: Colors.indigo + '60',
      }}>
        {/* Decorative circles */}
        <View style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.violet + '25' }} />
        <View style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.indigo + '20' }} />

        <Text style={{ color: '#C7D2FE', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Safe to Spend Daily
        </Text>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginBottom: 20, alignSelf: 'flex-start' }} />
        ) : (
          <>
            <Text style={{ color: '#FFFFFF', fontSize: 42, fontWeight: '800', letterSpacing: -1, marginBottom: 4 }}>
              {fmt(dailyAllowance)}
            </Text>
            <Text style={{ color: '#A5B4FC', fontSize: 14, marginBottom: 24 }}>
              Based on your remaining budget
            </Text>
          </>
        )}

        <View style={{ height: 1, backgroundColor: Colors.violet + '35', marginBottom: 18 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#A5B4FC', fontSize: 11, marginBottom: 2 }}>Net Flow</Text>
            <Text style={{ color: netFlow >= 0 ? '#34D399' : '#F87171', fontSize: 16, fontWeight: '700' }}>
              {netFlow >= 0 ? '+' : ''}{fmt(netFlow)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#A5B4FC', fontSize: 11, marginBottom: 2 }}>Active Debts</Text>
            <Text style={{ color: '#FBBF24', fontSize: 16, fontWeight: '700' }}>{fmt(activeDebt)}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────
function TransactionRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.transaction_type === 'INC';
  const color = isIncome ? Colors.successText : Colors.dangerText;
  const bg = isIncome ? Colors.successBg : Colors.dangerBg;
  const icon: keyof typeof Ionicons.glyphMap = isIncome ? 'arrow-up' : 'arrow-down';
  const date = new Date(tx.transaction_date);
  const dateStr = date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    }}>
      <View style={{
        width: 40, height: 40, borderRadius: 13,
        backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
        marginRight: 12, borderWidth: 1, borderColor: color + '30',
      }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
          {tx.category}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
          {tx.payment_method} · {dateStr}
        </Text>
      </View>
      <Text style={{ color, fontSize: 15, fontWeight: '700' }}>
        {isIncome ? '+' : '-'}{fmt(tx.amount)}
      </Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { summary, allowance, transactions, refetchAll } = useDashboard();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchAll();
    setRefreshing(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const summaryData = summary.data;
  const allowanceData = allowance.data;
  const recentTxs = transactions.data?.results?.slice(0, 5) ?? [];
  const isLoading = summary.loading || allowance.loading;

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
        <View style={{
          paddingTop: Platform.OS === 'ios' ? 56 : 48, paddingHorizontal: 24,
          paddingBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 2 }}>{greeting} 👋</Text>
            <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>Mwaiseghe</Text>
          </View>
          <View style={{
            width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.indigoDark,
            borderWidth: 2, borderColor: Colors.indigo, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>M</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Hero Card */}
          <HeroCard
            fadeAnim={fadeAnim}
            dailyAllowance={allowanceData?.daily_allowance ?? 0}
            netFlow={summaryData?.net_flow ?? 0}
            activeDebt={summaryData?.active_debt_total ?? 0}
            loading={isLoading}
          />

          {/* Stats Row */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <SummaryCard
              label="Income"
              value={isLoading ? '...' : fmt(summaryData?.monthly_income ?? 0)}
              type="success"
            />
            <SummaryCard
              label="Expenses"
              value={isLoading ? '...' : fmt(summaryData?.monthly_expense ?? 0)}
              type="danger"
            />
          </View>

          {/* Budget Progress */}
          <BudgetBar
            income={summaryData?.monthly_income ?? 0}
            expense={summaryData?.monthly_expense ?? 0}
          />

          {/* Quick Actions */}
          <View style={{
            backgroundColor: Colors.bgCard, borderRadius: 20, padding: 20,
            borderWidth: 1, borderColor: Colors.border, marginBottom: 24,
          }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>
              Quick Actions
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <QuickAction icon="arrow-up-circle" label="Add Income" color={Colors.successText} bg={Colors.successBg} />
              <QuickAction icon="arrow-down-circle" label="Add Expense" color={Colors.dangerText} bg={Colors.dangerBg} />
              <QuickAction icon="receipt" label="Pay Bill" color={Colors.violetLight} bg={Colors.violet + '20'} />
              <QuickAction icon="bar-chart" label="Reports" color={Colors.warning} bg={Colors.warningBg} />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ color: Colors.textPrimary, fontSize: 18, fontWeight: '700' }}>Recent Activity</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ color: Colors.indigo, fontSize: 13, fontWeight: '600' }}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <ActivityIndicator color={Colors.indigo} />
            </View>
          ) : recentTxs.length > 0 ? (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 20, paddingHorizontal: 16,
              borderWidth: 1, borderColor: Colors.border,
            }}>
              {recentTxs.map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </View>
          ) : (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 20, padding: 32,
              alignItems: 'center', justifyContent: 'center', borderWidth: 1,
              borderColor: Colors.border, borderStyle: 'dashed',
            }}>
              <View style={{
                width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bgSurface,
                alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                borderWidth: 1, borderColor: Colors.borderLight,
              }}>
                <Ionicons name="swap-horizontal-outline" size={28} color={Colors.textMuted} />
              </View>
              <Text style={{ color: Colors.textSecondary, fontSize: 15, fontWeight: '600', marginBottom: 6 }}>No transactions yet</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                Add your first income or expense{'\n'}to start tracking your flow.
              </Text>
              <TouchableOpacity activeOpacity={0.8} style={{
                marginTop: 20, paddingHorizontal: 24, paddingVertical: 12,
                backgroundColor: Colors.indigoDark, borderRadius: 14,
                borderWidth: 1, borderColor: Colors.indigo + '70',
              }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
