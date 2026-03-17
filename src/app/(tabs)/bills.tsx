import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type BillFilter = 'all' | 'upcoming' | 'paid';

function FilterPill({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: active ? color + '25' : Colors.bgCard,
        borderWidth: 1,
        borderColor: active ? color + '60' : Colors.border,
        marginRight: 8,
      }}
    >
      <Text style={{ color: active ? color : Colors.textMuted, fontSize: 13, fontWeight: '600' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function BudgetInfoCard() {
  return (
    <View
      style={{
        backgroundColor: Colors.indigoDark + 'CC',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.indigo + '50',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: Colors.indigo + '40',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Ionicons name="calculator" size={22} color="#A5B4FC" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
          Predictive Budgeting
        </Text>
        <Text style={{ color: '#818CF8', fontSize: 12, lineHeight: 18 }}>
          Bills are automatically factored into your "Safe to Spend" daily allowance — so you're never caught off guard.
        </Text>
      </View>
    </View>
  );
}

function SummaryChip({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: color + '30',
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: color + '25',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={{ color: color + 'AA', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ color, fontSize: 16, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

export default function Bills() {
  const [filter, setFilter] = useState<BillFilter>('all');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgBase }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgBase} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: Platform.OS === 'ios' ? 56 : 48,
            paddingHorizontal: 24,
            paddingBottom: 20,
          }}
        >
          <Text style={{ color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            Recurring Commitments
          </Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>
            Bills
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
            Never miss a recurring payment.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Summary chips */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <SummaryChip
              label="Due This Month"
              value="KES 0"
              icon="calendar"
              color={Colors.warning}
              bg={Colors.warningBg}
            />
            <SummaryChip
              label="Paid"
              value="KES 0"
              icon="checkmark-circle"
              color={Colors.successText}
              bg={Colors.successBg}
            />
            <SummaryChip
              label="Overdue"
              value="0"
              icon="alert-circle"
              color={Colors.dangerText}
              bg={Colors.dangerBg}
            />
          </View>

          {/* Predictive budgeting info */}
          <BudgetInfoCard />

          {/* Filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="Upcoming" active={filter === 'upcoming'} color={Colors.warning} onPress={() => setFilter('upcoming')} />
            <FilterPill label="Paid" active={filter === 'paid'} color={Colors.successText} onPress={() => setFilter('paid')} />
          </View>

          {/* Empty state */}
          <View
            style={{
              backgroundColor: Colors.bgCard,
              borderRadius: 20,
              padding: 36,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.border,
              borderStyle: 'dashed',
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: Colors.bgSurface,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: Colors.borderLight,
              }}
            >
              <Ionicons name="receipt-outline" size={28} color={Colors.textMuted} />
            </View>
            <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
              No bills tracked yet
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Track your subscriptions, rent,{'\n'}utilities and recurring payments.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginTop: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: Colors.indigoDark,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: Colors.indigo + '70',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
                Track New Bill
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 104 : 80,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: Colors.indigoDark,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: Colors.indigo,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
