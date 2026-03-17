import { View } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Bills() {
  return (
    <View className="flex-1 bg-white p-5">
      <View className="mb-8">
        <Typography variant="h1">Commitments</Typography>
        <Typography variant="body">Never miss a recurring payment.</Typography>
      </View>

      <Card className="items-center justify-center py-12">
        <Typography variant="body" className="text-gray-400">No upcoming bills tracked.</Typography>
        <Button 
          title="Track New Bill" 
          variant="primary" 
          className="mt-6 w-full"
        />
      </Card>
      
      <View className="mt-8">
        <Typography variant="h3" className="mb-4">Predictive Budgeting</Typography>
        <Card className="bg-gray-50 border-transparent">
          <Typography variant="body">
            Bills are automatically factored into your "Safe to Spend" daily allowance.
          </Typography>
        </Card>
      </View>
    </View>
  );
}

