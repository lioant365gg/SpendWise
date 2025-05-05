"use client";

import type * as React from 'react';
import { GroceryListItem } from './GroceryListItem';
import type { GroceryItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription

interface GroceryListProps {
  items: GroceryItem[];
  onToggleBought: (id: string) => void;
  onDeleteItem: (id: string) => void;
  listName: string; // Added listName prop
}

export function GroceryList({
  items,
  onToggleBought,
  onDeleteItem,
  listName, // Destructure listName
}: GroceryListProps) {
  if (items.length === 0) {
    return (
      <Card className="shadow-md mt-6"> {/* Added margin top */}
         <CardHeader>
           <CardTitle>{listName}</CardTitle> {/* Display list name */}
           <CardDescription>No items yet.</CardDescription> {/* Updated message */}
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
             Add items using the form above to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md mt-6"> {/* Added margin top */}
      <CardHeader>
        {/* Removed title here, handled by the list name in page.tsx header or could be {listName} Items */}
         {/* <CardTitle>Your Items</CardTitle> */}
         {/* If you still want a header inside this card specifically: */}
         {/* <CardTitle>{listName} Items</CardTitle> */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border"> {/* Use theme border */}
          {items.map((item) => (
            <GroceryListItem
              key={item.id}
              item={item}
              onToggleBought={onToggleBought}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
