"use client"; // Required for useState, useEffect, and event handlers

import { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for unique IDs

import { GroceryItemForm } from '@/components/GroceryItemForm';
import { GroceryList } from '@/components/GroceryList';
import { TotalSpend } from '@/components/TotalSpend';
import { ListSelector } from '@/components/ListSelector'; // New component
import { CreateListDialog } from '@/components/CreateListDialog'; // New component
import type { GroceryItem, GroceryListType, AppData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { generateGroceryListPdf } from '@/lib/pdf-utils'; // Import PDF utility


const LOCAL_STORAGE_KEY = 'spendwise_app_data_v3'; // Updated key for new structure

const DEFAULT_LIST_NAME = 'My Grocery List';

export default function Home() {
  const [lists, setLists] = useState<GroceryListType[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);

  // --- Data Loading and Saving ---

  // Load data from local storage on component mount (client-side only)
  useEffect(() => {
    setIsClient(true);
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData: AppData = JSON.parse(storedData);
        // Basic validation
        if (parsedData && Array.isArray(parsedData.lists) && typeof parsedData.currentListId !== 'undefined') {
           // Deeper validation (optional but recommended)
           const validLists = parsedData.lists.filter(list =>
             list && typeof list.id === 'string' && typeof list.name === 'string' && Array.isArray(list.items) &&
             list.items.every(item =>
               item && typeof item.id === 'string' && typeof item.name === 'string' &&
               typeof item.price === 'number' && typeof item.quantity === 'string' && typeof item.bought === 'boolean'
             )
           );

          if (validLists.length > 0) {
            setLists(validLists);
            // Ensure currentListId is valid or default to the first list
            const listExists = validLists.some(list => list.id === parsedData.currentListId);
            setCurrentListId(listExists ? parsedData.currentListId : validLists[0].id);
          } else if (lists.length === 0) { // Only create default if no valid lists and state is empty
             handleCreateList(DEFAULT_LIST_NAME); // Create a default list if storage is empty/invalid
          }

        } else {
          console.warn("Invalid data format in local storage (v3). Initializing.");
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
          handleCreateList(DEFAULT_LIST_NAME); // Create a default list
        }
      } catch (error) {
        console.error("Failed to parse data from local storage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
        handleCreateList(DEFAULT_LIST_NAME); // Create a default list
      }
    } else if (lists.length === 0) {
        // If no data in local storage and no lists yet, create the default one
        handleCreateList(DEFAULT_LIST_NAME);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Save data to local storage whenever lists or currentListId change (client-side only)
  useEffect(() => {
    if (isClient && lists.length > 0) { // Only run on client after initial mount and if lists exist
      const appData: AppData = { lists, currentListId };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    }
  }, [lists, currentListId, isClient]);

  // --- List Management ---

  const handleCreateList = useCallback((name: string) => {
    const newList: GroceryListType = {
      id: uuidv4(),
      name: name || DEFAULT_LIST_NAME, // Use default name if empty
      items: [],
    };
    setLists((prevLists) => [...prevLists, newList]);
    setCurrentListId(newList.id); // Switch to the newly created list
    setIsCreateListDialogOpen(false); // Close dialog
  }, []);

  const handleSelectList = (id: string) => {
    setCurrentListId(id);
  };

  // --- Item Management (for the current list) ---

  const handleAddItem = (newItemData: Omit<GroceryItem, 'id' | 'bought'>) => {
    if (!currentListId) return; // Don't add if no list is selected

    const itemToAdd: GroceryItem = {
      ...newItemData,
      id: uuidv4(),
      bought: false,
    };

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === currentListId
          ? { ...list, items: [...list.items, itemToAdd] }
          : list
      )
    );
  };

  const handleToggleBought = (itemId: string) => {
    if (!currentListId) return;

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === currentListId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, bought: !item.bought } : item
              ),
            }
          : list
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentListId) return;

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === currentListId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  // --- Derived State ---

  const currentList = useMemo(() => {
    if (!isClient) return null; // Avoid computation on server or before hydration
    return lists.find((list) => list.id === currentListId);
  }, [lists, currentListId, isClient]);

  const currentItems = useMemo(() => {
    return currentList?.items ?? [];
  }, [currentList]);

  // Calculate total spend for the current list
  const totalSpend = useMemo(() => {
    if (!currentList) return 0;
    return currentItems.reduce((total, item) => total + (item.price || 0), 0);
  }, [currentItems, currentList]); // Depend on currentItems


  // --- PDF Download ---
  const handleDownloadPdf = useCallback(() => {
    if (currentList && isClient) {
      generateGroceryListPdf(currentList.name, currentItems, totalSpend);
    }
  }, [currentList, currentItems, totalSpend, isClient]);


  // --- Rendering ---

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-3xl"> {/* Increased max-width */}
      <Card className="mb-8 shadow-lg border-primary border-2">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-0">
            SpendWise Grocery List
          </CardTitle>
           {isClient && lists.length > 0 && currentListId && (
             <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
              <ListSelector
                lists={lists}
                currentListId={currentListId}
                onSelectList={handleSelectList}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateListDialogOpen(true)}
                className="shrink-0"
              >
                <Plus className="mr-1 h-4 w-4" /> New List
              </Button>
              {currentList && ( // Only show download if a list is selected
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPdf}
                    className="shrink-0"
                    disabled={!isClient || !currentList} // Disable during SSR or if no list
                  >
                    <Download className="mr-1 h-4 w-4" /> PDF
                 </Button>
               )}
             </div>
           )}
        </CardHeader>
        <CardContent className="p-6">
           {isClient && !currentList && lists.length > 0 && (
             <p className="text-center text-muted-foreground mb-6">
               Select a list or create a new one to start adding items.
             </p>
           )}
           {isClient && currentList && (
             <>
                <p className="text-center text-muted-foreground mb-2">
                    Currently viewing: <span className="font-semibold">{currentList.name}</span>
                </p>
                <p className="text-center text-muted-foreground mb-6">
                  Track your grocery purchases. Add items below!
                </p>
                <GroceryItemForm onAddItem={handleAddItem} />
              </>
           )}
           {!isClient && (
             <div className="text-center p-10">Loading...</div>
           )}

        </CardContent>
      </Card>

      {isClient && currentList ? ( // Only render list and total if a list is selected on the client
        <>
          <GroceryList
            items={currentItems}
            onToggleBought={handleToggleBought}
            onDeleteItem={handleDeleteItem}
            listName={currentList.name} // Pass list name
          />
          <TotalSpend total={totalSpend} />
        </>
      ) : isClient && lists.length === 0 ? (
          // Handle the initial state where no lists exist yet
          <div className="text-center p-10">
              <p className="text-muted-foreground mb-4">No grocery lists found.</p>
               <Button onClick={() => setIsCreateListDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Your First List
               </Button>
          </div>
      ) : !isClient ? (
        // Optional: Show a loading state during server render/hydration
        <div className="text-center p-10">Loading your lists...</div>
      ) : null /* Or a message asking to select/create a list if lists exist but none selected */ }

      {/* Dialog for Creating New List */}
      <CreateListDialog
         isOpen={isCreateListDialogOpen}
         onClose={() => setIsCreateListDialogOpen(false)}
         onCreateList={handleCreateList}
       />
    </main>
  );
}
