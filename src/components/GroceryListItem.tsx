"use client";

import type * as React from 'react';
import { Trash2 } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { GroceryItem } from '@/types';
import { cn } from '@/lib/utils';

interface GroceryListItemProps {
  item: GroceryItem;
  onToggleBought: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function GroceryListItem({
  item,
  onToggleBought,
  onDeleteItem,
}: GroceryListItemProps) {
  const handleCheckboxChange = () => {
    onToggleBought(item.id);
  };

  const handleDeleteClick = () => {
    onDeleteItem(item.id);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b transition-colors duration-300',
        item.bought ? 'bg-secondary opacity-60' : 'bg-card'
      )}
    >
      <div className="flex items-center gap-4 flex-grow">
        <Checkbox
          id={`item-${item.id}`}
          checked={item.bought}
          onCheckedChange={handleCheckboxChange}
          aria-label={`Mark ${item.name} as bought`}
          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground"
        />
        <Label
          htmlFor={`item-${item.id}`}
          className={cn(
            'flex-grow cursor-pointer',
            item.bought && 'line-through text-muted-foreground'
          )}
        >
          <span className="font-medium">{item.name}</span>
        </Label>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'font-mono text-right w-20',
            item.bought && 'line-through text-muted-foreground'
          )}
        >
          ${item.price.toFixed(2)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          aria-label={`Delete ${item.name}`}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
