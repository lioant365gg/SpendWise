"use client"; // Required for useState and event handlers

import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for unique IDs

import { GroceryItemForm } from '@/components/GroceryItemForm';
import { GroceryList } from '@/components/GroceryList';
import { TotalSpend } from '@/components/TotalSpend';
import type { GroceryItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LOCAL_STORAGE_KEY = 'spendwise_grocery_list_v2'; // Updated key for new structure

export default function Home() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering

  // Load items from local storage on component mount (client-side only)
  useEffect(() => {
    setIsClient(true); // Indicate component has mounted on client
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        // Updated validation to include quantity
        if (Array.isArray(parsedItems) && parsedItems.every(item =>
            'id' in item &&
            'name' in item &&
            'price' in item &&
            'quantity' in item && // Check for quantity
            'bought' in item)) {
          setItems(parsedItems);
        } else {
          console.error("Invalid data format in local storage (v2). Clearing.");
          // Optionally, try migrating from old format if needed
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse items from local storage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }
  }, []);

  // Save items to local storage whenever the list changes (client-side only)
  useEffect(() => {
    if (isClient) { // Only run on client after initial mount
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isClient]);

  const handleAddItem = (newItem: Omit<GroceryItem, 'id' | 'bought'>) => {
    const itemToAdd: GroceryItem = {
      ...newItem, // Includes name, price, and quantity now
      id: uuidv4(), // Generate unique ID
      bought: false,
    };
    setItems((prevItems) => [...prevItems, itemToAdd]);
  };

  const handleToggleBought = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

    const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };


  // Calculate total spend based on items that are *not* marked as bought
  const totalSpend = useMemo(() => {
     if (!isClient) return 0; // Avoid calculation on server or before hydration
     return items.reduce((total, item) => {
       // Consider price only if item is added (not necessarily bought)
       return total + (item.price || 0);
     }, 0);
   }, [items, isClient]);


  return (
    <main className="container mx-auto p-4 md:p-8 max-w-2xl">
      <Card className="mb-8 shadow-lg border-primary border-2">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
          <CardTitle className="text-center text-2xl md:text-3xl">
            SpendWise Grocery List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground mb-6">
            Track your grocery purchases effortlessly. Add items below!
          </p>
          <GroceryItemForm onAddItem={handleAddItem} />
        </CardContent>
      </Card>

      {isClient ? ( // Only render list and total on the client
        <>
         <GroceryList
            items={items}
            onToggleBought={handleToggleBought}
            onDeleteItem={handleDeleteItem}
          />
          <TotalSpend total={totalSpend} />
        </>
      ) : (
         // Optional: Show a loading state during server render/hydration
         <div className="text-center p-10">Loading your list...</div>
      )}
    </main>
  );
}
