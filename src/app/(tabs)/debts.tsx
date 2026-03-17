import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Platform,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useDebts } from '@/hooks/useFinance';
import { Debt, DebtStatus } from '@/types/financeManager';
import { financeService } from '@/services/financeservice';
import { AddDebtModal } from '@/components/modals/AddDebtModal';

type DebtFilter = 'all' | 'BORROWED' | 'LENT';

const fmt = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}k` : `KES ${n.toLocaleString()}`;

const STATUS_LABELS: Record<DebtStatus, string> = { PENDING: 'Pending', PARTIAL: 'Partial', SETTLED: 'Settled' };
const STATUS_COLORS: Record<DebtStatus, string> = {
  PENDING: Colors.warning,
  PARTIAL: Colors.indigo,
  SETTLED: Colors.successText,
};

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

function DebtRow({ debt, onNudge }: { debt: Debt; onNudge: (id: string) => void }) {
  const isLent = debt.direction === 'LENT';
  const color = isLent ? Colors.successText : Colors.dangerText;
  const bg = isLent ? Colors.successBg : Colors.dangerBg;

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
        <Ionicons name={isLent ? 'arrow-undo' : 'arrow-redo'} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '600' }}>{debt.person_name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <View style={{
            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
            backgroundColor: STATUS_COLORS[debt.status] + '20',
          }}>
            <Text style={{ color: STATUS_COLORS[debt.status], fontSize: 10, fontWeight: '700' }}>
              {STATUS_LABELS[debt.status]}
            </Text>
          </View>
          {debt.due_date && (
            <Text style={{ color: Colors.textMuted, fontSize: 11 }}>
              Due {new Date(debt.due_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
            </Text>
          )}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color, fontSize: 15, fontWeight: '700' }}>{fmt(debt.amount)}</Text>
        {isLent && debt.status !== 'SETTLED' && (
          <TouchableOpacity onPress={() => onNudge(debt.id)} activeOpacity={0.75} style={{ marginTop: 4 }}>
            <Text style={{ color: Colors.violetLight, fontSize: 11, fontWeight: '600' }}>Nudge 👆</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function Debts() {
  const [filter, setFilter] = useState<DebtFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { debts, iOwe, owedToMe, loading, error, refetch } = useDebts();

  const filtered = filter === 'all' ? debts : debts.filter(d => d.direction === filter);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNudge = async (id: string) => {
    try {
      await financeService.debts.nudge(id);
      Alert.alert('Nudge Sent', 'A polite repayment reminder has been sent.');
    } catch {
      Alert.alert('Error', 'Could not send nudge. Please try again.');
    }
  };

  const netBalance = owedToMe - iOwe;

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
          <Text style={{ color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Social Accounting</Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>Debts & Loans</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Manage lending &amp; borrowing.</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Summary Cards */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: Colors.dangerBg, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.dangerText + '30' }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.dangerText + '25', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="arrow-redo" size={18} color={Colors.dangerText} />
              </View>
              <Text style={{ color: Colors.dangerText + 'AA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>I Owe</Text>
              {loading ? <ActivityIndicator color={Colors.dangerText} size="small" /> : (
                <Text style={{ color: Colors.dangerText, fontSize: 22, fontWeight: '800' }}>{fmt(iOwe)}</Text>
              )}
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.successBg, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.successText + '30' }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.successText + '25', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="arrow-undo" size={18} color={Colors.successText} />
              </View>
              <Text style={{ color: Colors.successText + 'AA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Owed To Me</Text>
              {loading ? <ActivityIndicator color={Colors.successText} size="small" /> : (
                <Text style={{ color: Colors.successText, fontSize: 22, fontWeight: '800' }}>{fmt(owedToMe)}</Text>
              )}
            </View>
          </View>

          {/* Net position */}
          {!loading && (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 18, padding: 16,
              borderWidth: 1, borderColor: Colors.border, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
            }}>
              <View>
                <Text style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 2 }}>Net Social Balance</Text>
                <Text style={{ color: netBalance >= 0 ? Colors.successText : Colors.dangerText, fontSize: 22, fontWeight: '800' }}>
                  {netBalance >= 0 ? '+' : ''}{fmt(netBalance)}
                </Text>
              </View>
              <View style={{
                backgroundColor: Colors.bgSurface, borderRadius: 12, paddingHorizontal: 12,
                paddingVertical: 6, borderWidth: 1, borderColor: Colors.borderLight,
              }}>
                <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                  {debts.length === 0 ? 'All Clear ✓' : `${debts.length} active`}
                </Text>
              </View>
            </View>
          )}

          {/* Filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="I Owe" active={filter === 'BORROWED'} color={Colors.dangerText} onPress={() => setFilter('BORROWED')} />
            <FilterPill label="Owed Me" active={filter === 'LENT'} color={Colors.successText} onPress={() => setFilter('LENT')} />
          </View>

          {/* Nudge info banner */}
          <View style={{
            backgroundColor: Colors.violet + '18', borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: Colors.violet + '35', flexDirection: 'row',
            alignItems: 'flex-start', gap: 12, marginBottom: 20,
          }}>
            <Ionicons name="information-circle" size={20} color={Colors.violetLight} style={{ marginTop: 1 }} />
            <Text style={{ color: Colors.violetLight, fontSize: 13, flex: 1, lineHeight: 20 }}>
              Tap <Text style={{ fontWeight: '700' }}>Nudge</Text> on any lent debt to send a polite repayment reminder.
            </Text>
          </View>

          {error && (
            <View style={{ backgroundColor: Colors.dangerBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.danger + '40' }}>
              <Text style={{ color: Colors.dangerText, fontSize: 13 }}>{error}</Text>
            </View>
          )}

          {/* Debt list / empty */}
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <ActivityIndicator color={Colors.indigo} size="large" />
              <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 12 }}>Loading debts…</Text>
            </View>
          ) : filtered.length > 0 ? (
            <View style={{ backgroundColor: Colors.bgCard, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border }}>
              {filtered.map(debt => <DebtRow key={debt.id} debt={debt} onNudge={handleNudge} />)}
            </View>
          ) : (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 20, padding: 36,
              alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
            }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight }}>
                <Ionicons name="people-outline" size={28} color={Colors.textMuted} />
              </View>
              <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>No active debts</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                Record money you've lent or{'\n'}borrowed to stay accountable.
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

      <AddDebtModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={refetch}
      />
    </View>
  );
}
