"use client";

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GroceryListType } from '@/types';
import { List } from 'lucide-react';

interface ListSelectorProps {
  lists: GroceryListType[];
  currentListId: string | null;
  onSelectList: (id: string) => void;
}

export function ListSelector({
  lists,
  currentListId,
  onSelectList,
}: ListSelectorProps) {
  if (!currentListId || lists.length === 0) {
    return null; // Don't render if no list is selected or no lists exist
  }

  return (
    <Select value={currentListId} onValueChange={onSelectList}>
      <SelectTrigger className="w-[180px] sm:w-[200px] md:w-[250px] text-sm h-9"> {/* Adjust width and height */}
         <List className="mr-2 h-4 w-4 text-muted-foreground" /> {/* Optional icon */}
        <SelectValue placeholder="Select a list" />
      </SelectTrigger>
      <SelectContent>
        {lists.map((list) => (
          <SelectItem key={list.id} value={list.id}>
            {list.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
