import { View } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Transactions() {
  return (
    <View className="flex-1 bg-white p-5">
      <View className="mb-8">
        <Typography variant="h1">Ledger</Typography>
        <Typography variant="body">Track every single cent.</Typography>
      </View>

      <Card className="items-center justify-center py-12">
        <Typography variant="body" className="text-gray-400">Transaction history will appear here.</Typography>
        <Button 
          title="Log First Transaction" 
          variant="primary" 
          className="mt-6 w-full"
        />
      </Card>
    </View>
  );
}

