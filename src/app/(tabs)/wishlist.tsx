import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type WishlistFilter = 'all' | 'cool' | 'waiting';

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

function ProtocolCard() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors.violet + '18',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.violet + '40',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          width: 48,
          height: 48,
          borderRadius: 16,
          backgroundColor: Colors.violet + '30',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="time" size={24} color={Colors.violetLight} />
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.violetLight, fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
          Cooling-Off Protocol
        </Text>
        <Text style={{ color: Colors.violet + 'CC', fontSize: 12, lineHeight: 18 }}>
          Items are locked behind a mandatory wait period — ensuring wants don't masquerade as needs.
        </Text>
      </View>
    </View>
  );
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.bgCard,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
      }}
    >
      <Text style={{ color, fontSize: 20, fontWeight: '800', marginBottom: 2 }}>{value}</Text>
      <Text style={{ color: Colors.textMuted, fontSize: 11, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

export default function Wishlist() {
  const [filter, setFilter] = useState<WishlistFilter>('all');

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
            Intentional Spending
          </Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>
            Wishlist
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
            Beat impulsive consumerism.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Protocol Card */}
          <ProtocolCard />

          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
            <StatBadge label="Total Wishes" value="0" color={Colors.violetLight} />
            <StatBadge label="Safe to Buy" value="0" color={Colors.successText} />
            <StatBadge label="Still Waiting" value="0" color={Colors.warning} />
          </View>

          {/* Filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="Safe to Buy" active={filter === 'cool'} color={Colors.successText} onPress={() => setFilter('cool')} />
            <FilterPill label="Cooling Off" active={filter === 'waiting'} color={Colors.warning} onPress={() => setFilter('waiting')} />
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
              <Ionicons name="heart-outline" size={28} color={Colors.textMuted} />
            </View>
            <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>
              Wishlist is empty
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
              Add items you want to buy.{'\n'}The cooling-off period will help you decide.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginTop: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: Colors.violet + '30',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: Colors.violet + '60',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="add" size={18} color={Colors.violetLight} />
              <Text style={{ color: Colors.violetLight, fontWeight: '700', fontSize: 14 }}>
                Add Wishlist Item
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
          backgroundColor: Colors.violet + '40',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: Colors.violet + '60',
          shadowColor: Colors.violet,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color={Colors.violetLight} />
      </TouchableOpacity>
    </View>
  );
}
