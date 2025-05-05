export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  quantity: string; // Added quantity field (e.g., "2 lbs", "1 piece", "500g")
  bought: boolean;
}
