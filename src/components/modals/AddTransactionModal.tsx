import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { BottomSheet, FormField, ToggleGroup, SubmitButton } from '@/components/ui/BottomSheet';
import { Colors } from '@/constants/colors';
import { financeService } from '@/services/financeservice';
import { TransactionType } from '@/types/financeManager';

const CATEGORIES_INC = ['Salary', 'Freelance', 'Business', 'Gift', 'Investment', 'Other'];
const CATEGORIES_EXP = ['Food', 'Transport', 'Housing', 'Health', 'Shopping', 'Entertainment', 'Utilities', 'Education', 'Other'];
const PAYMENT_METHODS = ['M-Pesa', 'Cash', 'Bank', 'Card'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: TransactionType;
}

export function AddTransactionModal({ visible, onClose, onSuccess, defaultType = 'EXP' }: Props) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === 'INC' ? CATEGORIES_INC : CATEGORIES_EXP;
  const finalCategory = category === 'Other' ? customCategory : category;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!finalCategory.trim()) e.category = 'Select or enter a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setAmount(''); setCategory(''); setCustomCategory('');
    setPaymentMethod('M-Pesa'); setDescription('');
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await financeService.transactions.create({
        transaction_type: type,
        amount: Number(amount),
        category: finalCategory.trim(),
        payment_method: paymentMethod,
        description: description.trim() || null,
        transaction_date: new Date().toISOString(),
      });
      reset();
      onClose();
      onSuccess();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail || 'Could not save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={type === 'INC' ? 'Add Income 💰' : 'Add Expense 💸'}
      subtitle="Every cent counts — log it accurately."
    >
      {/* Type toggle */}
      <ToggleGroup
        label="Type"
        value={type}
        onChange={(v) => { setType(v); setCategory(''); }}
        options={[
          { value: 'INC', label: 'Income', color: Colors.successText, icon: 'arrow-up-circle' },
          { value: 'EXP', label: 'Expense', color: Colors.dangerText, icon: 'arrow-down-circle' },
        ]}
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

      {/* Category chips */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
          Category
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {categories.map(c => {
            const active = category === c;
            return (
              <Text
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: active ? Colors.indigo + '25' : Colors.bgCard,
                  borderWidth: 1, borderColor: active ? Colors.indigo + '70' : Colors.border,
                  color: active ? Colors.indigo : Colors.textSecondary,
                  fontSize: 13, fontWeight: active ? '700' : '500',
                  overflow: 'hidden',
                }}
              >{c}</Text>
            );
          })}
        </View>
        {category === 'Other' && (
          <FormField
            label="Custom Category"
            placeholder="e.g. Side hustle"
            value={customCategory}
            onChangeText={setCustomCategory}
            style={{ marginTop: 12, marginBottom: 0 }}
          />
        )}
        {errors.category ? <Text style={{ color: Colors.dangerText, fontSize: 11, marginTop: 4 }}>{errors.category}</Text> : null}
      </View>

      {/* Payment method */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
          Payment Method
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {PAYMENT_METHODS.map(m => {
            const active = paymentMethod === m;
            return (
              <Text
                key={m}
                onPress={() => setPaymentMethod(m)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: active ? Colors.violet + '25' : Colors.bgCard,
                  borderWidth: 1, borderColor: active ? Colors.violet + '70' : Colors.border,
                  color: active ? Colors.violetLight : Colors.textSecondary,
                  fontSize: 13, fontWeight: active ? '700' : '500',
                  overflow: 'hidden',
                }}
              >{m}</Text>
            );
          })}
        </View>
      </View>

      {/* Optional description */}
      <FormField
        label="Note (Optional)"
        placeholder="What was this for?"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 72, textAlignVertical: 'top' }}
      />

      <SubmitButton
        title={type === 'INC' ? 'Save Income' : 'Save Expense'}
        onPress={handleSubmit}
        loading={loading}
        color={type === 'INC' ? '#065F46' : '#7F1D1D'}
        borderColor={type === 'INC' ? Colors.successText + '80' : Colors.dangerText + '80'}
      />
    </BottomSheet>
  );
}
