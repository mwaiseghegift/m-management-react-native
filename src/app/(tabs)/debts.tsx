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

type DebtFilter = 'all' | 'owe' | 'owed';

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

function DebtSummaryCard({
  label,
  value,
  color,
  icon,
  bgColor,
}: {
  label: string;
  value: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: color + '30',
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: color + '25',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={{ color: color + 'AA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color, fontSize: 22, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

export default function Debts() {
  const [filter, setFilter] = useState<DebtFilter>('all');

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
            Social Accounting
          </Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>
            Debts & Loans
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
            Manage lending &amp; borrowing.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Summary Cards */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <DebtSummaryCard
              label="I Owe"
              value="KES 0"
              color={Colors.dangerText}
              icon="arrow-redo"
              bgColor={Colors.dangerBg}
            />
            <DebtSummaryCard
              label="Owed To Me"
              value="KES 0"
              color={Colors.successText}
              icon="arrow-undo"
              bgColor={Colors.successBg}
            />
          </View>

          {/* Net position */}
          <View
            style={{
              backgroundColor: Colors.bgCard,
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: Colors.border,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <View>
              <Text style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 2 }}>Net Social Balance</Text>
              <Text style={{ color: Colors.successText, fontSize: 22, fontWeight: '800' }}>KES 0</Text>
            </View>
            <View
              style={{
                backgroundColor: Colors.bgSurface,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: Colors.borderLight,
              }}
            >
              <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600' }}>All Settled ✓</Text>
            </View>
          </View>

          {/* Filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="I Owe" active={filter === 'owe'} color={Colors.dangerText} onPress={() => setFilter('owe')} />
            <FilterPill label="Owed Me" active={filter === 'owed'} color={Colors.successText} onPress={() => setFilter('owed')} />
          </View>

          {/* Info banner */}
          <View
            style={{
              backgroundColor: Colors.violet + '18',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: Colors.violet + '35',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Ionicons name="information-circle" size={20} color={Colors.violetLight} style={{ marginTop: 1 }} />
            <Text style={{ color: Colors.violetLight, fontSize: 13, flex: 1, lineHeight: 20 }}>
              Use the <Text style={{ fontWeight: '700' }}>Nudge</Text> feature to send polite repayment reminders to debtors.
            </Text>
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
              <Ionicons name="people-outline" size={28} color={Colors.textMuted} />
            </View>
            <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
              No active debts
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Record money you've lent or{'\n'}borrowed to stay accountable.
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
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Add Debt Entry</Text>
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
