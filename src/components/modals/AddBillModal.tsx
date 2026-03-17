import React, { useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { BottomSheet, FormField, ToggleGroup, SubmitButton } from '@/components/ui/BottomSheet';
import { Colors } from '@/constants/colors';
import { financeService } from '@/services/financeservice';
import { BillFrequency } from '@/types/financeManager';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DUE_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export function AddBillModal({ visible, onClose, onSuccess }: Props) {
  const [providerName, setProviderName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<BillFrequency>('MON');
  const [dueDay, setDueDay] = useState(1);
  const [isAutopay, setIsAutopay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!providerName.trim()) e.providerName = 'Enter the provider name';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setProviderName(''); setAmount(''); setFrequency('MON');
    setDueDay(1); setIsAutopay(false); setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await financeService.bills.create({
        provider_name: providerName.trim(),
        amount: Number(amount),
        frequency,
        due_day: dueDay,
        is_autopay: isAutopay,
      });
      reset();
      onClose();
      onSuccess();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail || 'Could not save bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="Track New Bill 🧾"
      subtitle="Auto-factored into your daily spending allowance."
    >
      {/* Provider */}
      <FormField
        label="Provider / Service"
        placeholder="e.g. Safaricom Fiber, Netflix"
        value={providerName}
        onChangeText={setProviderName}
        autoCapitalize="words"
        error={errors.providerName}
      />

      {/* Amount */}
      <FormField
        label="Amount (KES)"
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        error={errors.amount}
      />

      {/* Frequency */}
      <ToggleGroup
        label="Frequency"
        value={frequency}
        onChange={setFrequency}
        options={[
          { value: 'MON', label: 'Monthly', color: Colors.indigo },
          { value: 'QUART', label: 'Quarterly', color: Colors.violet },
          { value: 'YEAR', label: 'Annual', color: Colors.warning },
        ]}
      />

      {/* Due day picker */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
          Due Day of {frequency === 'MON' ? 'Month' : 'Period'}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {DUE_DAYS.map(d => {
            const active = dueDay === d;
            return (
              <Text
                key={d}
                onPress={() => setDueDay(d)}
                style={{
                  width: 42, textAlign: 'center',
                  paddingVertical: 8, borderRadius: 10,
                  backgroundColor: active ? Colors.indigo + '25' : Colors.bgCard,
                  borderWidth: 1, borderColor: active ? Colors.indigo + '70' : Colors.border,
                  color: active ? Colors.indigo : Colors.textMuted,
                  fontSize: 13, fontWeight: active ? '800' : '400',
                  overflow: 'hidden',
                }}
              >{d}</Text>
            );
          })}
        </View>
        {dueDay && (
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 8 }}>
            📅 Due on the <Text style={{ color: Colors.indigo, fontWeight: '700' }}>{ordinal(dueDay)}</Text> of every {frequency === 'MON' ? 'month' : frequency === 'QUART' ? 'quarter' : 'year'}.
          </Text>
        )}
      </View>

      {/* Autopay toggle */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: Colors.bgCard, borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '600' }}>Auto-Pay</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
            Mark as automatically deducted
          </Text>
        </View>
        <Switch
          value={isAutopay}
          onValueChange={setIsAutopay}
          trackColor={{ false: Colors.bgSurface, true: Colors.indigo + '60' }}
          thumbColor={isAutopay ? Colors.indigo : Colors.textMuted}
        />
      </View>

      {/* Predictive budgeting note */}
      <View style={{
        backgroundColor: Colors.indigoDark + 'AA', borderRadius: 12, padding: 12,
        borderWidth: 1, borderColor: Colors.indigo + '40', marginBottom: 8,
      }}>
        <Text style={{ color: '#A5B4FC', fontSize: 12, lineHeight: 18 }}>
          💡 This bill will be factored into your <Text style={{ fontWeight: '700' }}>Safe to Spend</Text> daily allowance automatically.
        </Text>
      </View>

      <SubmitButton
        title="Track Bill"
        onPress={handleSubmit}
        loading={loading}
      />
    </BottomSheet>
  );
}
