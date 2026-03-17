import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = ({ 
  title, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  className,
  disabled,
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-800',
    outline: 'bg-transparent border border-gray-200',
    ghost: 'bg-transparent',
    danger: 'bg-rose-600',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-gray-900',
    ghost: 'text-blue-600',
    danger: 'text-white',
  };

  const sizes = {
    sm: 'py-2 px-4 rounded-xl',
    md: 'py-3.5 px-6 rounded-2xl',
    lg: 'py-4 px-8 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-lg font-bold',
  };

  return (
    <TouchableOpacity
      className={`${variants[variant]} ${sizes[size]} flex-row justify-center items-center ${disabled || loading ? 'opacity-50' : ''} ${className || ''}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#007AFF' : '#FFFFFF'} />
      ) : (
        <Text className={`${textColors[variant]} ${textSizes[size]} text-center`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
