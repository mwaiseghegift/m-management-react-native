import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { SummaryCard } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

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
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{ alignItems: 'center', flex: 1 }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          borderWidth: 1,
          borderColor: color + '30',
        }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={{ color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Budget Progress Bar ─────────────────────────────────────────────────────
function BudgetBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min(used / total, 1);
  const barColor = pct > 0.85 ? Colors.danger : pct > 0.65 ? Colors.warning : Colors.indigo;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: pct,
      duration: 900,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        backgroundColor: Colors.bgCard,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Monthly Budget
        </Text>
        <Text style={{ color: barColor, fontSize: 12, fontWeight: '700' }}>
          {Math.round(pct * 100)}% used
        </Text>
      </View>
      {/* Track */}
      <View style={{ height: 8, backgroundColor: Colors.bgSurface, borderRadius: 8, overflow: 'hidden' }}>
        <Animated.View
          style={{
            height: '100%',
            width: barWidth,
            backgroundColor: barColor,
            borderRadius: 8,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
          KES {used.toLocaleString()} spent
        </Text>
        <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
          KES {(total - used).toLocaleString()} left
        </Text>
      </View>
    </View>
  );
}

// ─── Hero Balance Card ────────────────────────────────────────────────────────
function HeroCard({ fadeAnim }: { fadeAnim: Animated.Value }) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        marginBottom: 20,
      }}
    >
      <View
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: Colors.indigoDark,
          padding: 28,
          borderWidth: 1,
          borderColor: Colors.indigo + '60',
        }}
      >
        {/* Decorative circles */}
        <View
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: Colors.violet + '25',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: Colors.indigo + '20',
          }}
        />

        {/* Content */}
        <Text style={{ color: '#C7D2FE', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
          Safe to Spend Daily
        </Text>
        <Text style={{ color: '#FFFFFF', fontSize: 42, fontWeight: '800', letterSpacing: -1, marginBottom: 4 }}>
          KES 1,250
        </Text>
        <Text style={{ color: '#A5B4FC', fontSize: 14, marginBottom: 24 }}>
          Based on your remaining budget
        </Text>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: Colors.violet + '35', marginBottom: 18 }} />

        {/* Footer row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#A5B4FC', fontSize: 11, marginBottom: 2 }}>Net Flow</Text>
            <Text style={{ color: '#34D399', fontSize: 16, fontWeight: '700' }}>+KES 33k</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#A5B4FC', fontSize: 11, marginBottom: 2 }}>Pending Bills</Text>
            <Text style={{ color: '#F87171', fontSize: 16, fontWeight: '700' }}>KES 4,500</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#A5B4FC', fontSize: 11, marginBottom: 2 }}>Debts Out</Text>
            <Text style={{ color: '#FBBF24', fontSize: 16, fontWeight: '700' }}>KES 2,000</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgBase }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgBase} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          style={{
            paddingTop: Platform.OS === 'ios' ? 56 : 48,
            paddingHorizontal: 24,
            paddingBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ color: Colors.textSecondary, fontSize: 13, marginBottom: 2 }}>
              {greeting} 👋
            </Text>
            <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
              Mwaiseghe
            </Text>
          </View>
          {/* Avatar */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: Colors.indigoDark,
              borderWidth: 2,
              borderColor: Colors.indigo,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>M</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* ── Hero Card ── */}
          <HeroCard fadeAnim={fadeAnim} />

          {/* ── Stats Row ── */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <SummaryCard label="Income" value="KES 45k" type="success" />
            <SummaryCard label="Expenses" value="KES 12k" type="danger" />
          </View>

          {/* ── Budget Progress ── */}
          <BudgetBar used={12000} total={45000} />

          {/* ── Quick Actions ── */}
          <View
            style={{
              backgroundColor: Colors.bgCard,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: Colors.border,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: Colors.textSecondary,
                fontSize: 11,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: 16,
              }}
            >
              Quick Actions
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <QuickAction
                icon="arrow-up-circle"
                label="Add Income"
                color={Colors.successText}
                bg={Colors.successBg}
              />
              <QuickAction
                icon="arrow-down-circle"
                label="Add Expense"
                color={Colors.dangerText}
                bg={Colors.dangerBg}
              />
              <QuickAction
                icon="receipt"
                label="Pay Bill"
                color={Colors.violetLight}
                bg={Colors.violet + '20'}
              />
              <QuickAction
                icon="bar-chart"
                label="Reports"
                color={Colors.warning}
                bg={Colors.warningBg}
              />
            </View>
          </View>

          {/* ── Recent Activity ── */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ color: Colors.textPrimary, fontSize: 18, fontWeight: '700' }}>
              Recent Activity
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ color: Colors.indigo, fontSize: 13, fontWeight: '600' }}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View
            style={{
              backgroundColor: Colors.bgCard,
              borderRadius: 20,
              padding: 32,
              alignItems: 'center',
              justifyContent: 'center',
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
              <Ionicons name="swap-horizontal-outline" size={28} color={Colors.textMuted} />
            </View>
            <Text style={{ color: Colors.textSecondary, fontSize: 15, fontWeight: '600', marginBottom: 6 }}>
              No transactions yet
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Add your first income or expense{'\n'}to start tracking your flow.
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
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
                Add Transaction
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
