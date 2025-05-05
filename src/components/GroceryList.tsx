"use client";

import type * as React from 'react';
import { GroceryListItem } from './GroceryListItem';
import type { GroceryItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GroceryListProps {
  items: GroceryItem[];
  onToggleBought: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function GroceryList({
  items,
  onToggleBought,
  onDeleteItem,
}: GroceryListProps) {
  if (items.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Your grocery list is empty. Add some items above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Your Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
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
