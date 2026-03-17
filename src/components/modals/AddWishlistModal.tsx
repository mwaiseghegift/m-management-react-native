import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { BottomSheet, FormField, SubmitButton } from '@/components/ui/BottomSheet';
import { Colors } from '@/constants/colors';
import { financeService } from '@/services/financeservice';
import { WishlistPriority } from '@/types/financeManager';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COOLING_OPTIONS = [
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
];

function PriorityPicker({ value, onChange }: { value: WishlistPriority; onChange: (v: WishlistPriority) => void }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
        Priority
      </Text>
      <Text style={{ color: Colors.textMuted, fontSize: 11, marginBottom: 10 }}>
        1 = must have &nbsp;·&nbsp; 5 = nice to have
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {([1, 2, 3, 4, 5] as WishlistPriority[]).map(p => {
          const active = value === p;
          return (
            <TouchableOpacity
              key={p}
              onPress={() => onChange(p)}
              activeOpacity={0.75}
              style={{
                flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12,
                backgroundColor: active ? Colors.violet + '25' : Colors.bgCard,
                borderWidth: 1.5, borderColor: active ? Colors.violet + '80' : Colors.border,
              }}
            >
              <Ionicons name="star" size={18} color={active ? Colors.violetLight : Colors.textMuted} />
              <Text style={{ color: active ? Colors.violetLight : Colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4 }}>{p}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function AddWishlistModal({ visible, onClose, onSuccess }: Props) {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<WishlistPriority>(3);
  const [urlLink, setUrlLink] = useState('');
  const [coolingDays, setCoolingDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!itemName.trim()) e.itemName = 'Enter the item name';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Enter a valid price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setItemName(''); setPrice(''); setPriority(3); setUrlLink(''); setCoolingDays(7);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    // Calculate cooling_off_until
    const until = new Date();
    until.setDate(until.getDate() + coolingDays);
    try {
      await financeService.wishlist.create({
        item_name: itemName.trim(),
        estimated_price: Number(price),
        priority,
        url_link: urlLink.trim() || null,
        cooling_off_until: until.toISOString().split('T')[0], // YYYY-MM-DD
      });
      reset();
      onClose();
      onSuccess();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.detail || 'Could not save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="Add to Wishlist ✨"
      subtitle="Think twice before you buy — let it cool off first."
    >
      {/* Item name */}
      <FormField
        label="Item Name"
        placeholder="e.g. Sony WH-1000XM5"
        value={itemName}
        onChangeText={setItemName}
        autoCapitalize="words"
        error={errors.itemName}
      />

      {/* Price */}
      <FormField
        label="Estimated Price (KES)"
        placeholder="0.00"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        error={errors.price}
      />

      {/* Priority */}
      <PriorityPicker value={priority} onChange={setPriority} />

      {/* Cooling period */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
          Cooling-Off Period
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {COOLING_OPTIONS.map(opt => {
            const active = coolingDays === opt.days;
            return (
              <Text
                key={opt.days}
                onPress={() => setCoolingDays(opt.days)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: active ? Colors.violet + '25' : Colors.bgCard,
                  borderWidth: 1, borderColor: active ? Colors.violet + '70' : Colors.border,
                  color: active ? Colors.violetLight : Colors.textSecondary,
                  fontSize: 13, fontWeight: active ? '700' : '500',
                  overflow: 'hidden',
                }}
              >{opt.label}</Text>
            );
          })}
        </View>
        <View style={{ backgroundColor: Colors.violet + '15', borderRadius: 10, padding: 10, marginTop: 10, borderWidth: 1, borderColor: Colors.violet + '30' }}>
          <Text style={{ color: Colors.violetLight, fontSize: 12 }}>
            🔒 Locked until{' '}
            <Text style={{ fontWeight: '700' }}>
              {(() => { const d = new Date(); d.setDate(d.getDate() + coolingDays); return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }); })()}
            </Text>
          </Text>
        </View>
      </View>

      {/* URL link */}
      <FormField
        label="Product Link (Optional)"
        placeholder="https://..."
        value={urlLink}
        onChangeText={setUrlLink}
        keyboardType="url"
        autoCapitalize="none"
        hint="Paste a link to the product page"
      />

      <SubmitButton
        title="Add to Wishlist"
        onPress={handleSubmit}
        loading={loading}
        color={Colors.violet + '60'}
        borderColor={Colors.violet + '80'}
      />
    </BottomSheet>
  );
}
