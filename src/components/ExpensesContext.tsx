
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  currency: string;
  category: string;
  trip: string;
  date: string;
  convertedAmountUSD: number;
}

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  const addExpense = (expense: Expense) => {
    const updated = [...expenses, expense];
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}