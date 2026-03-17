import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { BottomSheet, FormField, ToggleGroup, SubmitButton } from '@/components/ui/BottomSheet';
import { Colors } from '@/constants/colors';
import { financeService } from '@/services/financeservice';
import { DebtDirection } from '@/types/financeManager';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTS = [
  { value: 'PENDING' as const, label: 'Pending', color: Colors.warning },
  { value: 'PARTIAL' as const, label: 'Partial', color: Colors.indigo },
];

export function AddDebtModal({ visible, onClose, onSuccess }: Props) {
  const [direction, setDirection] = useState<DebtDirection>('LENT');
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!personName.trim()) e.personName = 'Enter the person\'s name';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (dueDate && isNaN(Date.parse(dueDate))) e.dueDate = 'Enter a valid date (YYYY-MM-DD)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setPersonName(''); setAmount(''); setDueDate('');
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await financeService.debts.create({
        person_name: personName.trim(),
        amount: Number(amount),
        direction,
        status: 'PENDING',
        due_date: dueDate.trim() || null,
      });
      reset();
      onClose();
      onSuccess();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail || 'Could not save debt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  const isLent = direction === 'LENT';

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={isLent ? 'Money Lent 🤝' : 'Money Borrowed 🙏'}
      subtitle="Track every social financial obligation."
    >
      {/* Direction toggle */}
      <ToggleGroup
        label="Direction"
        value={direction}
        onChange={setDirection}
        options={[
          { value: 'LENT', label: 'I Lent', color: Colors.successText, icon: 'arrow-undo' },
          { value: 'BORROWED', label: 'I Borrowed', color: Colors.dangerText, icon: 'arrow-redo' },
        ]}
      />

      {/* Context banner */}
      <View style={{
        backgroundColor: (isLent ? Colors.successBg : Colors.dangerBg),
        borderRadius: 12, padding: 12, marginBottom: 16,
        borderWidth: 1, borderColor: (isLent ? Colors.successText : Colors.dangerText) + '30',
      }}>
        <Text style={{ color: isLent ? Colors.successText : Colors.dangerText, fontSize: 12, lineHeight: 18 }}>
          {isLent
            ? '💡 Recording money you lent. You can send a nudge reminder later.'
            : '💡 Recording borrowed money. This will show in your "I Owe" balance.'}
        </Text>
      </View>

      {/* Person name */}
      <FormField
        label="Person's Name"
        placeholder="e.g. Brian Kamau"
        value={personName}
        onChangeText={setPersonName}
        autoCapitalize="words"
        error={errors.personName}
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

      {/* Due date */}
      <FormField
        label="Due Date (Optional)"
        placeholder="YYYY-MM-DD"
        value={dueDate}
        onChangeText={setDueDate}
        keyboardType="numbers-and-punctuation"
        hint="Leave blank if there's no fixed deadline"
        error={errors.dueDate}
      />

      <SubmitButton
        title={isLent ? 'Record Lent Money' : 'Record Borrowed Money'}
        onPress={handleSubmit}
        loading={loading}
        color={isLent ? '#065F46' : '#7F1D1D'}
        borderColor={isLent ? Colors.successText + '80' : Colors.dangerText + '80'}
      />
    </BottomSheet>
  );
}
