import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Platform,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useBills } from '@/hooks/useFinance';
import { Bill, BillFrequency } from '@/types/financeManager';
import { financeService } from '@/services/financeservice';
import { AddBillModal } from '@/components/modals/AddBillModal';

type BillFilter = 'all' | 'upcoming' | 'paid';

const fmt = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}k` : `KES ${n.toLocaleString()}`;

const FREQ_LABELS: Record<BillFrequency, string> = { MON: 'Monthly', QUART: 'Quarterly', YEAR: 'Annual' };
const FREQ_COLORS: Record<BillFrequency, string> = { MON: Colors.indigo, QUART: Colors.violet, YEAR: Colors.warning };

function FilterPill({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
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

function BillRow({ bill, onPay }: { bill: Bill; onPay: (id: string) => void }) {
  const now = new Date();
  const isPaidThisMonth = bill.last_paid_date
    ? (() => { const d = new Date(bill.last_paid_date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })()
    : false;
  const isOverdue = !isPaidThisMonth && bill.due_day < now.getDate();
  const daysUntilDue = bill.due_day - now.getDate();

  const statusColor = isPaidThisMonth ? Colors.successText : isOverdue ? Colors.dangerText : Colors.warning;
  const statusBg = isPaidThisMonth ? Colors.successBg : isOverdue ? Colors.dangerBg : Colors.warningBg;
  const statusLabel = isPaidThisMonth ? 'Paid' : isOverdue ? 'Overdue' : `Due in ${daysUntilDue}d`;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    }}>
      <View style={{
        width: 44, height: 44, borderRadius: 14, backgroundColor: statusBg,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
        borderWidth: 1, borderColor: statusColor + '30',
      }}>
        <Ionicons name={isPaidThisMonth ? 'checkmark-circle' : isOverdue ? 'alert-circle' : 'calendar'} size={20} color={statusColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{bill.provider_name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: FREQ_COLORS[bill.frequency] + '20' }}>
            <Text style={{ color: FREQ_COLORS[bill.frequency], fontSize: 10, fontWeight: '700' }}>{FREQ_LABELS[bill.frequency]}</Text>
          </View>
          <Text style={{ color: Colors.textMuted, fontSize: 11 }}>
            {statusLabel}
          </Text>
          {bill.is_autopay && (
            <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: Colors.indigo + '20' }}>
              <Text style={{ color: Colors.indigo, fontSize: 10, fontWeight: '700' }}>AUTO</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text style={{ color: statusColor, fontSize: 15, fontWeight: '700' }}>{fmt(bill.amount)}</Text>
        {!isPaidThisMonth && (
          <TouchableOpacity
            onPress={() => onPay(bill.id)}
            activeOpacity={0.75}
            style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.indigo + '25', borderWidth: 1, borderColor: Colors.indigo + '50' }}
          >
            <Text style={{ color: Colors.indigo, fontSize: 11, fontWeight: '700' }}>Pay</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function Bills() {
  const [filter, setFilter] = useState<BillFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { bills, dueThisMonth, paidThisMonth, overdueCount, loading, error, refetch } = useBills();

  const now = new Date();
  const filtered = filter === 'all' ? bills
    : filter === 'paid'
      ? bills.filter(b => b.last_paid_date && (() => { const d = new Date(b.last_paid_date!); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })())
      : bills.filter(b => b.due_day >= now.getDate());

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePay = async (id: string) => {
    Alert.alert('Pay Bill', 'Mark this bill as paid and log a transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay',
        onPress: async () => {
          try {
            await financeService.bills.pay(id);
            await refetch();
            Alert.alert('Paid ✓', 'Bill marked as paid and transaction logged.');
          } catch {
            Alert.alert('Error', 'Could not process payment. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgBase }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgBase} />
      <ScrollView
        style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.indigo} />}
      >
        {/* Header */}
        <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 48, paddingHorizontal: 24, paddingBottom: 20 }}>
          <Text style={{ color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Recurring Commitments</Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>Bills</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Never miss a recurring payment.</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Summary chips */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Due This Month', value: fmt(dueThisMonth), icon: 'calendar' as const, color: Colors.warning, bg: Colors.warningBg },
              { label: 'Paid', value: fmt(paidThisMonth), icon: 'checkmark-circle' as const, color: Colors.successText, bg: Colors.successBg },
              { label: 'Overdue', value: String(overdueCount), icon: 'alert-circle' as const, color: Colors.dangerText, bg: Colors.dangerBg },
            ].map(s => (
              <View key={s.label} style={{ flex: 1, backgroundColor: s.bg, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: s.color + '30' }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: s.color + '25', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Ionicons name={s.icon} size={16} color={s.color} />
                </View>
                <Text style={{ color: s.color + 'AA', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>{s.label}</Text>
                {loading ? <ActivityIndicator color={s.color} size="small" /> : (
                  <Text style={{ color: s.color, fontSize: 16, fontWeight: '800' }}>{s.value}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Predictive budgeting info */}
          <View style={{
            backgroundColor: Colors.indigoDark + 'CC', borderRadius: 20, padding: 20,
            borderWidth: 1, borderColor: Colors.indigo + '50', marginBottom: 20,
            flexDirection: 'row', alignItems: 'flex-start', gap: 14,
          }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.indigo + '40', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ionicons name="calculator" size={22} color="#A5B4FC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#C7D2FE', fontSize: 14, fontWeight: '700', marginBottom: 4 }}>Predictive Budgeting</Text>
              <Text style={{ color: '#818CF8', fontSize: 12, lineHeight: 18 }}>
                Bills are automatically factored into your "Safe to Spend" daily allowance.
              </Text>
            </View>
          </View>

          {/* Filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="Upcoming" active={filter === 'upcoming'} color={Colors.warning} onPress={() => setFilter('upcoming')} />
            <FilterPill label="Paid" active={filter === 'paid'} color={Colors.successText} onPress={() => setFilter('paid')} />
          </View>

          {error && (
            <View style={{ backgroundColor: Colors.dangerBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.danger + '40' }}>
              <Text style={{ color: Colors.dangerText, fontSize: 13 }}>{error}</Text>
            </View>
          )}

          {/* List / loading / empty */}
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <ActivityIndicator color={Colors.indigo} size="large" />
              <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 12 }}>Loading bills…</Text>
            </View>
          ) : filtered.length > 0 ? (
            <View style={{ backgroundColor: Colors.bgCard, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border }}>
              {filtered.map(bill => <BillRow key={bill.id} bill={bill} onPay={handlePay} />)}
            </View>
          ) : (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 20, padding: 36,
              alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
            }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight }}>
                <Ionicons name="receipt-outline" size={28} color={Colors.textMuted} />
              </View>
              <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>No bills tracked yet</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                Track your subscriptions, rent,{'\n'}utilities and recurring payments.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => setShowModal(true)} style={{
        position: 'absolute', bottom: Platform.OS === 'ios' ? 104 : 80, right: 24,
        width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.indigoDark,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.indigo, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8,
      }}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <AddBillModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={refetch}
      />
    </View>
  );
}
