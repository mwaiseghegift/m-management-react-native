import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const { height: SCREEN_H } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Override sheet max height (default 90%) */
  snapHeight?: number;
}

export function BottomSheet({ visible, onClose, title, subtitle, children, snapHeight = 0.9 }: BottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_H,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.7)',
          opacity: backdropAnim,
        }} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        pointerEvents="box-none"
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: Colors.bgSurface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: SCREEN_H * snapHeight,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: Colors.border,
            overflow: 'hidden',
          }}
        >
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingTop: 12 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
            paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={{ color: Colors.textMuted, fontSize: 13, marginTop: 2 }}>{subtitle}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                width: 32, height: 32, borderRadius: 10,
                backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: Colors.border, marginLeft: 12,
              }}
            >
              <Ionicons name="close" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Thin rule */}
          <View style={{ height: 1, backgroundColor: Colors.border, marginHorizontal: 24, marginBottom: 4 }} />

          {/* Scrollable body */}
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: Platform.OS === 'ios' ? 48 : 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Shared form input ────────────────────────────────────────────────────────

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
}

export function FormField({ label, hint, error, style, ...props }: FormFieldProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={Colors.textMuted}
        style={[{
          backgroundColor: Colors.bgCard,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: error ? Colors.danger + '80' : Colors.border,
          color: Colors.textPrimary,
          fontSize: 15,
          fontWeight: '500',
          paddingHorizontal: 16,
          paddingVertical: 14,
        }, style]}
        {...props}
      />
      {hint && !error ? <Text style={{ color: Colors.textMuted, fontSize: 11, marginTop: 4 }}>{hint}</Text> : null}
      {error ? <Text style={{ color: Colors.dangerText, fontSize: 11, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}

// ─── Toggle button group ──────────────────────────────────────────────────────
export function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; color: string; icon?: keyof typeof Ionicons.glyphMap }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {options.map(opt => {
          const active = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.75}
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                paddingVertical: 12, borderRadius: 14, gap: 6,
                backgroundColor: active ? opt.color + '20' : Colors.bgCard,
                borderWidth: 1.5,
                borderColor: active ? opt.color + '80' : Colors.border,
              }}
            >
              {opt.icon && <Ionicons name={opt.icon} size={16} color={active ? opt.color : Colors.textMuted} />}
              <Text style={{ color: active ? opt.color : Colors.textMuted, fontSize: 13, fontWeight: '700' }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Primary submit button ────────────────────────────────────────────────────
export function SubmitButton({
  title,
  onPress,
  loading,
  color = Colors.indigoDark,
  borderColor = Colors.indigo,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  color?: string;
  borderColor?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
      style={{
        backgroundColor: color,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor,
        opacity: loading ? 0.6 : 1,
        marginTop: 8,
        flexDirection: 'row',
        gap: 8,
      }}
    >
      {loading
        ? <Ionicons name="sync" size={18} color="#FFFFFF" />
        : null}
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 }}>
        {loading ? 'Saving…' : title}
      </Text>
    </TouchableOpacity>
  );
}
