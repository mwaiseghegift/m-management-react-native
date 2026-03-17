import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { TextInput } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="mb-12">
          <Typography variant="h1" className="text-4xl text-blue-600 mb-2">FlowWare</Typography>
          <Typography variant="body" className="text-gray-500">
            Securely manage your behavioral finance ecosystem.
          </Typography>
        </View>

        <Card className="p-8 mb-6">
          <View className="mb-6">
            <Typography variant="label" className="mb-2">Email Address</Typography>
            <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="text-gray-900 font-medium"
              />
            </View>
          </View>

          <View className="mb-8">
            <Typography variant="label" className="mb-2">Password</Typography>
            <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="text-gray-900 font-medium"
              />
            </View>
          </View>

          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            loading={loading}
            className="mb-4"
          />
          
          <Button 
            title="Create an account" 
            variant="ghost" 
            size="sm"
            onPress={() => Alert.alert('Registration', 'Registration flow coming soon!')}
          />
        </Card>

        <View className="items-center">
            <Typography variant="caption" className="text-gray-400">
                Developed by MwaisegheWare
            </Typography>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
