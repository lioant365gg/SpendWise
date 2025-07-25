"use client";

import type * as React from 'react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { GroceryItem } from '@/types';

interface GroceryItemFormProps {
  onAddItem: (item: Omit<GroceryItem, 'id' | 'bought'>) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required' }),
  quantity: z.string().min(1, { message: 'Quantity is required' }), // Added quantity validation
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .positive({ message: 'Price must be positive' })
    .min(0.01, { message: 'Price must be at least $0.01' }),
});

type FormData = z.infer<typeof formSchema>;

export function GroceryItemForm({ onAddItem }: GroceryItemFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: '', // Added quantity default value
      price: undefined, // Set initial price to undefined to allow placeholder
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    onAddItem({ name: data.name, quantity: data.quantity, price: data.price }); // Include quantity
    form.reset(); // Reset form after submission
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6 p-4 bg-secondary rounded-lg shadow" // Responsive grid
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:col-span-2 lg:col-span-1"> {/* Responsive column span */}
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Apples" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="lg:col-span-1"> {/* Responsive column span */}
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2 lbs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="lg:col-span-1"> {/* Responsive column span */}
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.99"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : parseFloat(value)); // Handle empty string for number input
                  }}
                  value={field.value ?? ''} // Ensure value is controlled and handles undefined
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="sm:col-span-2 lg:col-span-1 w-full sm:w-auto lg:justify-self-end"> {/* Responsive button width and placement */}
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </form>
    </Form>
  );
}
