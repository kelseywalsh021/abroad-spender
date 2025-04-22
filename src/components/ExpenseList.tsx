
'use client';


import { useEffect, useState } from 'react';

export default function ExpenseList() {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [convertedExpenses, setConvertedExpenses] = useState<any[]>([]); // To store converted amounts

  const loadExpenses = () => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    } else {
      setExpenses([]);
    }
  };

  const convertToUSD = async (amount: string, originalCurrency: string) => {
    if (originalCurrency === 'USD') {
      return parseFloat(amount); // Already USD
    }

    try {
      const link = `https://api.exchangerate.host/convert?access_key=${API_KEY}&from=${originalCurrency}&to=USD&amount=${amount}&format=1`
      const response = await fetch(link);
      const data = await response.json();
      console.log(data);

      if (data.success && data.result != null) {
        /*const rate = data.rates.USD;
        return parseFloat(amount) * rate;*/
        
        return data.result;
      } else {
        console.log(link)
        console.error("Currency conversion failed.");
        return parseFloat(amount); // If conversion fails, return original amount
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return parseFloat(amount); // If error, return original amount
    }
  };

  useEffect(() => {
    loadExpenses();

    // Listen to custom storage event
    const handleStorageChange = () => {
      loadExpenses();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchConvertedExpenses = async () => {
      const updatedExpenses = await Promise.all(
        expenses.map(async (expense) => {
          const convertedAmount = await convertToUSD(expense.amount, expense.originalCurrency);
          return { ...expense, convertedAmount: convertedAmount.toFixed(2) };
        })
      );
      setConvertedExpenses(updatedExpenses);
    };

    if (expenses.length > 0) {
      fetchConvertedExpenses();
    }
  }, [expenses]);

  if (expenses.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No expenses yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Saved Expenses</h3>
      {convertedExpenses.map((expense) => (
        <div
          key={expense.id}
          className="p-4 border rounded bg-white shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{expense.description}</p>
            <p className="text-sm text-gray-500">
              {expense.trip} · {expense.category} · {expense.date}
            </p>
          </div>
          <p className="font-bold">
            {expense.originalAmount} {expense.originalCurrency} → {expense.convertedAmount} USD
          </p>
        </div>
      ))}
    </div>
  );
}