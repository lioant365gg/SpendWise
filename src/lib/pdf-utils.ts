// src/lib/pdf-utils.ts
'use client'; // This function will run on the client side

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { GroceryItem } from '@/types';
import { format } from 'date-fns'; // For formatting the date

/**
 * Generates a PDF document for the grocery list.
 *
 * @param listName The name of the grocery list.
 * @param items The array of grocery items in the list.
 * @param totalSpend The total calculated spend for the list.
 */
export const generateGroceryListPdf = (
  listName: string,
  items: GroceryItem[],
  totalSpend: number
) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const margin = 15;
  let cursorY = margin;

  // --- Document Header ---
  doc.setFontSize(18);
  doc.text(`Grocery List: ${listName}`, margin, cursorY);
  cursorY += 10;

  doc.setFontSize(10);
  doc.setTextColor(100); // Gray color
  doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, margin, cursorY);
  cursorY += 10;

  // --- Table Content ---
  const tableColumn = ["Item Name", "Quantity", "Price", "Bought"];
  const tableRows: (string | number)[][] = [];

  items.forEach(item => {
    const itemData = [
      item.name,
      item.quantity,
      `$${item.price.toFixed(2)}`, // Format price
      item.bought ? "Yes" : "No"
    ];
    tableRows.push(itemData);
  });

  // Add autoTable plugin
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: cursorY,
    headStyles: { fillColor: [126, 148, 126] }, // Match primary color (adjust HSL if needed)
    theme: 'grid', // or 'striped', 'plain'
    margin: { top: cursorY }
  });

  // Get Y position after the table
  cursorY = (doc as any).lastAutoTable.finalY + 15; // Use the finalY property added by autoTable

  // --- Total Spend ---
   // Adjust if cursor is too close to the bottom
  if (cursorY > pageHeight - margin) {
    doc.addPage();
    cursorY = margin;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0); // Black color
  const totalText = `Total Spend: $${totalSpend.toFixed(2)}`;
  const totalTextWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - margin - totalTextWidth, cursorY);


  // --- Filename ---
  // Sanitize list name for filename
  const safeListName = listName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `grocery_list_${safeListName}_${format(new Date(), 'yyyyMMdd')}.pdf`;

  // --- Save the PDF ---
  doc.save(fileName);
};
