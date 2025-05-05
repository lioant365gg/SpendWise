export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  quantity: string; // e.g., "2 lbs", "1 piece", "500g"
  bought: boolean;
}

export interface GroceryListType {
  id: string;
  name: string;
  items: GroceryItem[];
}

// Structure for local storage
export interface AppData {
  lists: GroceryListType[];
  currentListId: string | null;
}
