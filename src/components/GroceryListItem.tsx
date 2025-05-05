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
        'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b transition-colors duration-300 gap-2', // Allow flex-col on mobile, gap for spacing
        item.bought ? 'bg-secondary opacity-60' : 'bg-card'
      )}
    >
      <div className="flex items-center gap-3 flex-grow w-full sm:w-auto min-w-0"> {/* Allow full width on mobile, gap-3 */}
        <Checkbox
          id={`item-${item.id}`}
          checked={item.bought}
          onCheckedChange={handleCheckboxChange}
          aria-label={`Mark ${item.name} as bought`}
          className="shrink-0 data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-accent-foreground" // shrink-0
        />
        <Label
          htmlFor={`item-${item.id}`}
          className={cn(
            'flex-grow cursor-pointer break-words', // Allow word breaking
            item.bought && 'line-through text-muted-foreground'
          )}
        >
          <span className="font-medium">{item.name}</span>
          <span className={cn("text-xs text-muted-foreground ml-1.5", item.bought && 'text-muted-foreground/80')}> {/* Smaller margin */}
            ({item.quantity}) {/* Display quantity */}
          </span>
        </Label>
      </div>
      <div className="flex items-center gap-3 ml-0 sm:ml-4 self-end sm:self-center"> {/* Align end on mobile, gap-3 */}
        <span
          className={cn(
            'font-mono text-right w-auto sm:w-20 shrink-0', // Allow auto width on mobile
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
          className="text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8" // Smaller icon button
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
