import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Platform,
  ActivityIndicator, RefreshControl, Animated, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useWishlist } from '@/hooks/useFinance';
import { Wishlist } from '@/types/financeManager';

type WishlistFilter = 'all' | 'cool' | 'waiting';

const fmt = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}k` : `KES ${n.toLocaleString()}`;

const PRIORITY_LABELS: Record<number, string> = { 1: '⭐⭐⭐⭐⭐', 2: '⭐⭐⭐⭐', 3: '⭐⭐⭐', 4: '⭐⭐', 5: '⭐' };

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

function WishlistItem({ item }: { item: Wishlist }) {
  const isCool = item.is_cool && !item.is_purchased;
  const isPurchased = item.is_purchased;
  const coolingUntil = new Date(item.cooling_off_until);
  const daysLeft = Math.ceil((coolingUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const accentColor = isPurchased ? Colors.textMuted : isCool ? Colors.successText : Colors.warning;
  const bgColor = isPurchased ? Colors.bgSurface : isCool ? Colors.successBg : Colors.warningBg;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    }}>
      <View style={{
        width: 44, height: 44, borderRadius: 14, backgroundColor: bgColor,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
        borderWidth: 1, borderColor: accentColor + '30',
      }}>
        <Ionicons
          name={isPurchased ? 'checkmark-circle' : isCool ? 'heart' : 'time'}
          size={20}
          color={accentColor}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.textPrimary, fontSize: 14, fontWeight: '600', textDecorationLine: isPurchased ? 'line-through' : 'none' }}
          numberOfLines={1}>
          {item.item_name}
        </Text>
        <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>
          {PRIORITY_LABELS[item.priority]}
        </Text>
        {!isCool && !isPurchased && daysLeft > 0 && (
          <Text style={{ color: Colors.warning, fontSize: 11, marginTop: 2, fontWeight: '600' }}>
            🕒 {daysLeft}d until unlock
          </Text>
        )}
        {isCool && (
          <Text style={{ color: Colors.successText, fontSize: 11, marginTop: 2, fontWeight: '600' }}>
            ✓ Safe to buy
          </Text>
        )}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: accentColor, fontSize: 15, fontWeight: '700' }}>{fmt(item.estimated_price)}</Text>
        {item.url_link && (
          <TouchableOpacity onPress={() => item.url_link && Linking.openURL(item.url_link)} style={{ marginTop: 4 }}>
            <Text style={{ color: Colors.indigo, fontSize: 11, fontWeight: '600' }}>View →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    <View style={{
      backgroundColor: Colors.violet + '18', borderRadius: 20, padding: 20,
      borderWidth: 1, borderColor: Colors.violet + '40', marginBottom: 24,
      flexDirection: 'row', alignItems: 'center', gap: 16,
    }}>
      <Animated.View style={{
        transform: [{ scale: pulseAnim }], width: 48, height: 48,
        borderRadius: 16, backgroundColor: Colors.violet + '30',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="time" size={24} color={Colors.violetLight} />
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.violetLight, fontSize: 14, fontWeight: '700', marginBottom: 4 }}>Cooling-Off Protocol</Text>
        <Text style={{ color: Colors.violet + 'CC', fontSize: 12, lineHeight: 18 }}>
          Items are locked behind a mandatory wait period — wants don't masquerade as needs.
        </Text>
      </View>
    </View>
  );
}

export default function WishlistScreen() {
  const [filter, setFilter] = useState<WishlistFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { items, coolItems, waitingItems, count, loading, error, refetch } = useWishlist();

  const filtered = filter === 'all' ? items : filter === 'cool' ? items.filter(i => i.is_cool && !i.is_purchased) : items.filter(i => !i.is_cool && !i.is_purchased);

  const totalValue = items.reduce((acc, i) => acc + (i.is_purchased ? 0 : i.estimated_price), 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
          <Text style={{ color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Intentional Spending</Text>
          <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>Wishlist</Text>
          <Text style={{ color: Colors.textMuted, fontSize: 14 }}>Beat impulsive consumerism.</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <ProtocolCard />

          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Total Wishes', value: String(count), color: Colors.violetLight },
              { label: 'Safe to Buy', value: String(coolItems.length), color: Colors.successText },
              { label: 'Cooling Off', value: String(waitingItems.length), color: Colors.warning },
            ].map(s => (
              <View key={s.label} style={{ flex: 1, backgroundColor: Colors.bgCard, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' }}>
                {loading ? <ActivityIndicator color={s.color} size="small" /> : (
                  <Text style={{ color: s.color, fontSize: 20, fontWeight: '800', marginBottom: 2 }}>{s.value}</Text>
                )}
                <Text style={{ color: Colors.textMuted, fontSize: 11, textAlign: 'center' }}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Total value */}
          {!loading && totalValue > 0 && (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 18, padding: 16,
              borderWidth: 1, borderColor: Colors.border, flexDirection: 'row',
              justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
            }}>
              <Text style={{ color: Colors.textMuted, fontSize: 13 }}>Total Wishlist Value</Text>
              <Text style={{ color: Colors.violetLight, fontSize: 18, fontWeight: '800' }}>{fmt(totalValue)}</Text>
            </View>
          )}

          {/* Filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <FilterPill label="All" active={filter === 'all'} color={Colors.indigo} onPress={() => setFilter('all')} />
            <FilterPill label="Safe to Buy" active={filter === 'cool'} color={Colors.successText} onPress={() => setFilter('cool')} />
            <FilterPill label="Cooling Off" active={filter === 'waiting'} color={Colors.warning} onPress={() => setFilter('waiting')} />
          </View>

          {error && (
            <View style={{ backgroundColor: Colors.dangerBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.danger + '40' }}>
              <Text style={{ color: Colors.dangerText, fontSize: 13 }}>{error}</Text>
            </View>
          )}

          {/* List / loading / empty */}
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <ActivityIndicator color={Colors.violet} size="large" />
              <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 12 }}>Loading wishlist…</Text>
            </View>
          ) : filtered.length > 0 ? (
            <View style={{ backgroundColor: Colors.bgCard, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border }}>
              {filtered.map(item => <WishlistItem key={item.id} item={item} />)}
            </View>
          ) : (
            <View style={{
              backgroundColor: Colors.bgCard, borderRadius: 20, padding: 36,
              alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
            }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight }}>
                <Ionicons name="heart-outline" size={28} color={Colors.textMuted} />
              </View>
              <Text style={{ color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginBottom: 6 }}>Wishlist is empty</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                Add items you want to buy.{'\n'}The cooling-off period will help you decide.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity activeOpacity={0.85} style={{
        position: 'absolute', bottom: Platform.OS === 'ios' ? 104 : 80, right: 24,
        width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.violet + '40',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: Colors.violet + '60',
        shadowColor: Colors.violet, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
      }}>
        <Ionicons name="add" size={28} color={Colors.violetLight} />
      </TouchableOpacity>
    </View>
  );
}
