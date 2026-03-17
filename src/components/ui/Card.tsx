import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Card = ({ title, subtitle, children, className, ...props }: CardProps) => {
  return (
    <View 
      className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${className || ''}`}
      {...props}
    >
      {(title || subtitle) && (
        <View className="mb-4">
          {title && <Text className="text-lg font-bold text-gray-900">{title}</Text>}
          {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
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
  className 
}: { 
  label: string, 
  value: string, 
  type?: 'default' | 'success' | 'danger' | 'primary',
  className?: string 
}) => {
  const bgColors = {
    default: 'bg-white',
    success: 'bg-emerald-50',
    danger: 'bg-rose-50',
    primary: 'bg-blue-600',
  };

  const textColors = {
    default: 'text-gray-900',
    success: 'text-emerald-600',
    danger: 'text-rose-600',
    primary: 'text-white',
  };

  const labelColors = {
    default: 'text-gray-500',
    success: 'text-emerald-500',
    danger: 'text-rose-500',
    primary: 'text-blue-100',
  };

  return (
    <View className={`${bgColors[type]} rounded-2xl p-4 shadow-sm flex-1 ${type === 'primary' ? 'shadow-blue-200' : 'border border-gray-100'} ${className || ''}`}>
      <Text className={`text-xs font-semibold uppercase tracking-wider mb-1 ${labelColors[type]}`}>{label}</Text>
      <Text className={`text-xl font-bold ${textColors[type]}`}>{value}</Text>
    </View>
  );
};
