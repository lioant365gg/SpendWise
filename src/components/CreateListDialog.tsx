"use client";

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Import DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (name: string) => void;
}

export function CreateListDialog({
  isOpen,
  onClose,
  onCreateList,
}: CreateListDialogProps) {
  const [listName, setListName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!listName.trim()) {
      setError('List name cannot be empty.');
      return;
    }
    onCreateList(listName);
    setListName(''); // Reset name after creation
    setError(''); // Clear error
    // onClose(); // onCreateList should handle closing if successful
  };

  const handleClose = () => {
     setListName(''); // Reset name on close
     setError(''); // Clear error on close
     onClose();
  }

  // Use Dialog's onOpenChange to handle closing via overlay click or escape key
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Grocery List</DialogTitle>
          <DialogDescription>
            Enter a name for your new list.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="list-name" className="text-right">
              Name
            </Label>
            <Input
              id="list-name"
              value={listName}
              onChange={(e) => {
                setListName(e.target.value)
                if (error) setError(''); // Clear error on input change
              }}
              className="col-span-3"
              placeholder="e.g., Weekly Groceries"
            />
          </div>
           {error && <p className="col-span-4 text-sm text-destructive text-center">{error}</p>}
        </div>
        <DialogFooter>
           <DialogClose asChild>
             <Button type="button" variant="outline" onClick={handleClose}> {/* Explicitly call handleClose */}
                Cancel
             </Button>
           </DialogClose>
          <Button type="button" onClick={handleCreate}>Create List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
