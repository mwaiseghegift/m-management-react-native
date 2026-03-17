import { View } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Debts() {
  return (
    <View className="flex-1 bg-white p-5">
      <View className="mb-8">
        <Typography variant="h1">Social Accounting</Typography>
        <Typography variant="body">Manage Lending & Borrowing.</Typography>
      </View>

      <View className="flex-row gap-4 mb-6">
        <Card className="flex-1 items-center p-4">
          <Typography variant="label">I Owe</Typography>
          <Typography variant="h3" className="text-rose-600">KES 0</Typography>
        </Card>
        <Card className="flex-1 items-center p-4">
          <Typography variant="label">Owed To Me</Typography>
          <Typography variant="h3" className="text-emerald-600">KES 0</Typography>
        </Card>
      </View>

      <Card className="items-center justify-center py-12">
        <Typography variant="body" className="text-gray-400">No active debts or loans.</Typography>
        <Button 
          title="Add Debt Entry" 
          variant="outline" 
          className="mt-6 w-full"
        />
      </Card>
    </View>
  );
}

