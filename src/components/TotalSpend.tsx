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
    <div className="mt-6 p-4 bg-primary text-primary-foreground rounded-lg shadow flex justify-between items-center">
      <h2 className="text-lg font-semibold">Total Spend:</h2>
       <span className={`text-2xl font-bold font-mono transition-all duration-300 ${animatedTotal !== total ? 'text-accent' : ''}`}>
         ${animatedTotal.toFixed(2)}
       </span>
    </div>
  );
}
