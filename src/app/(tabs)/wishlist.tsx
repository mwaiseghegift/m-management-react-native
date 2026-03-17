import { View } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Wishlist() {
  return (
    <View className="flex-1 bg-white p-5">
      <View className="mb-8">
        <Typography variant="h1">Intentional Spending</Typography>
        <Typography variant="body">Beat impulsive consumerism.</Typography>
      </View>

      <Card className="bg-blue-50 border-blue-100 mb-6">
        <Typography variant="h3" className="text-blue-900 mb-1">Cooling-Off Protocol</Typography>
        <Typography variant="caption" className="text-blue-700">
          Every item added is locked behind a mandatory waiting period to ensure it's a need, not a want.
        </Typography>
      </Card>

      <Card className="items-center justify-center py-12">
        <Typography variant="body" className="text-gray-400">Your wishlist is empty.</Typography>
        <Button 
          title="Add Wishlist Item" 
          variant="primary" 
          className="mt-6 w-full"
        />
      </Card>
    </View>
  );
}

