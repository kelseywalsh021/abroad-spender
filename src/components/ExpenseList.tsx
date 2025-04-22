
'use client';

import { useEffect, useState } from 'react';

export default function ExpenseList() {
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
      const response = await fetch(`https://api.exchangerate.host/latest?base=${originalCurrency}&symbols=USD`);
      const data = await response.json();

      if (data.success && data.rates && data.rates.USD) {
        const rate = data.rates.USD;
        return parseFloat(amount) * rate;
      } else {
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

/*

'use client';

import { useEffect, useState } from 'react';

const convertToUSD = async (amount: string, originalCurrency: string) => {
  if (originalCurrency === 'USD') return parseFloat(amount);
  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${originalCurrency}&to=USD&amount=${amount}`
    );
    const json = await res.json();
    return json.success && json.result != null
      ? json.result
      : parseFloat(amount);
  } catch (e) {
    console.error("Convert error:", e);
    return parseFloat(amount);
  }
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<any[]>([]);

  const loadExpenses = () => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    } else {
      setExpenses([]);
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

  const displayConvertedExpenses = async () => {
    const convertedExpenses = await Promise.all(
      expenses.map(async (expense) => {
        const convertedAmount = await convertToUSD(
          expense.amount.toString(),
          expense.originalCurrency
        );
        return { ...expense, convertedAmount };
      })
    );
    setExpenses(convertedExpenses);
  };

  useEffect(() => {
    displayConvertedExpenses();
  }, [expenses]);

  if (expenses.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No expenses yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Saved Expenses</h3>
      {expenses.map((expense) => (
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
            {expense.convertedAmount.toFixed(2)} USD
          </p>
        </div>
      ))}
    </div>
  );
}*/