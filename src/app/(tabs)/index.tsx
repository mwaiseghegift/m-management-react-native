import { View, ScrollView } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { Card, SummaryCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
  return (
    <ScrollView 
      className="flex-1 bg-white" 
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-8">
        <Typography variant="h1">FlowWare</Typography>
        <Typography variant="body">Welcome back, Mwaiseghe</Typography>
      </View>

      {/* Primary Status Card */}
      <SummaryCard 
        label="Safe to Spend Daily" 
        value="KES 1,250" 
        type="primary"
        className="mb-6 p-8"
      />

      {/* Stats Grid */}
      <View className="flex-row gap-4 mb-8">
        <SummaryCard 
          label="Income" 
          value="KES 45k" 
          type="success"
        />
        <SummaryCard 
          label="Expenses" 
          value="KES 12k" 
          type="danger"
        />
      </View>

      <View className="flex-row justify-between items-end mb-4">
        <Typography variant="h3">Recent Activity</Typography>
        <Button title="See All" variant="ghost" size="sm" />
      </View>

      <Card className="items-center justify-center py-12">
        <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
           {/* Icon placeholder */}
        </View>
        <Typography variant="body" className="text-gray-400">No recent transactions yet.</Typography>
        <Button 
          title="Add Transaction" 
          variant="outline" 
          size="sm" 
          className="mt-4"
        />
      </Card>
      
      <View className="h-20" />
    </ScrollView>
  );
}

