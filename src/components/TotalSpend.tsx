"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';

interface TotalSpendProps {
  total: number;
}

export function TotalSpend({ total }: TotalSpendProps) {
    const [animatedTotal, setAnimatedTotal] = useState(total);

    // Basic animation effect for total change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setAnimatedTotal(total);
        }, 100); // Short delay for animation effect

        return () => clearTimeout(timeoutId);
    }, [total]);


  return (
    <div className="mt-6 p-4 bg-primary text-primary-foreground rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"> {/* Use flex-col on mobile, gap-2 */}
       <h2 className="text-base sm:text-lg font-semibold">Total Spend:</h2> {/* Responsive text size */}
       <span className={`text-xl sm:text-2xl font-bold font-mono transition-all duration-300 self-end sm:self-center ${animatedTotal !== total ? 'text-accent' : ''}`}> {/* Responsive text size and alignment */}
         ${animatedTotal.toFixed(2)}
       </span>
    </div>
  );
}
