import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  children: React.ReactNode;
}

export const Typography = ({ 
  variant = 'body', 
  children, 
  className, 
  ...props 
}: TypographyProps) => {
  const variants = {
    h1: 'text-3xl font-extrabold text-gray-900 tracking-tight',
    h2: 'text-2xl font-bold text-gray-900',
    h3: 'text-xl font-bold text-gray-800',
    body: 'text-base text-gray-600 leading-6',
    caption: 'text-sm text-gray-500',
    label: 'text-xs font-semibold text-gray-400 uppercase tracking-widest',
  };

  return (
    <Text 
      className={`${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </Text>
  );
};
