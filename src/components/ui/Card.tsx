import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Card = ({ title, subtitle, children, style, ...props }: CardProps) => {
  return (
    <View
      style={[{
        backgroundColor: Colors.bgCard,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
      }, style]}
      {...props}
    >
      {(title || subtitle) && (
        <View style={{ marginBottom: 16 }}>
          {title && <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary }}>{title}</Text>}
          {subtitle && <Text style={{ fontSize: 14, color: Colors.textSecondary }}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
};

export const SummaryCard = ({
  label,
  value,
  type = 'default',
  style,
}: {
  label: string;
  value: string;
  type?: 'default' | 'success' | 'danger' | 'primary';
  style?: object;
}) => {
  const configs = {
    default: {
      bg: Colors.bgCard,
      valueCo: Colors.textPrimary,
      labelCo: Colors.textSecondary,
      border: Colors.border,
    },
    success: {
      bg: Colors.successBg,
      valueCo: Colors.successText,
      labelCo: Colors.success,
      border: '#0D3D2A',
    },
    danger: {
      bg: Colors.dangerBg,
      valueCo: Colors.dangerText,
      labelCo: Colors.danger,
      border: '#3D1010',
    },
    primary: {
      bg: Colors.indigoDark,
      valueCo: '#FFFFFF',
      labelCo: '#C7D2FE',
      border: Colors.indigo,
    },
  };

  const cfg = configs[type];

  return (
    <View
      style={[{
        backgroundColor: cfg.bg,
        borderRadius: 20,
        padding: 16,
        flex: 1,
        borderWidth: 1,
        borderColor: cfg.border,
      }, style]}
    >
      <Text style={{ fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, color: cfg.labelCo, marginBottom: 6 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '800', color: cfg.valueCo }}>
        {value}
      </Text>
    </View>
  );
};
