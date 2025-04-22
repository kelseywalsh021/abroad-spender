
'use client';

import { useState } from 'react';

export default function AddExpenseForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [trip, setTrip] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'MXN'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const originalAmount = parseFloat(amount);
    let convertedAmount = originalAmount;

    try {
      const response = await fetch(`https://api.exchangerate.host/latest?base=${currency}&symbols=USD`);
      const data = await response.json();

      if (data.success && data.rates && data.rates.USD) {
        const rate = data.rates.USD;
        convertedAmount = originalAmount * rate;
      } else {
        console.error("Currency conversion failed or rate unavailable.");
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: convertedAmount.toFixed(2), // store converted USD amount
      originalAmount: originalAmount.toFixed(2), // store original amount
      originalCurrency: currency, // store original currency
      currency: 'USD', // always store as USD for consistency
      trip,
      category,
      date,
    };

    const stored = localStorage.getItem('expenses');
    const existingExpenses = stored ? JSON.parse(stored) : [];

    const updatedExpenses = [newExpense, ...existingExpenses];
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Clear form fields
    setDescription('');
    setAmount('');
    setCurrency('USD');
    setTrip('');
    setCategory('');
    setDate('');

    // Let the ExpenseList component know to re-render
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <input
        type="text"
        placeholder="Description"
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        className="w-full p-2 border rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {currencyOptions.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Trip Name"
        className="w-full p-2 border rounded"
        value={trip}
        onChange={(e) => setTrip(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        className="w-full p-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Expense
      </button>
    </form>
  );
}/*

'use client';

import { useState, useEffect } from 'react';

export default function AddExpenseForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [trip, setTrip] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const originalAmount = parseFloat(amount);
    let convertedAmount = originalAmount;

    if (currency !== 'USD') {
      try {
        const res = await fetch(
          `https://api.exchangerate.host/convert?from=${currency}&to=USD&amount=${originalAmount}`
        );
        const data = await res.json();
        if (data.success && data.result != null) {
          convertedAmount = data.result;
        } else {
          console.error("Conversion API returned no result:", data);
        }
      } catch (err) {
        console.error("Error calling convert endpoint:", err);
      }
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: convertedAmount,
      originalCurrency: currency, // Store the original currency
      currency: 'USD', // Always store the converted amount in USD
      trip,
      category,
      date,
    };

    const stored = localStorage.getItem('expenses');
    const existingExpenses = stored ? JSON.parse(stored) : [];

    const updatedExpenses = [newExpense, ...existingExpenses];
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Clear form fields
    setDescription('');
    setAmount('');
    setCurrency('USD');
    setTrip('');
    setCategory('');
    setDate('');

    // Let the ExpenseList component know to re-render
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <input
        type="text"
        placeholder="Description"
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        className="w-full p-2 border rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Currency"
        className="w-full p-2 border rounded"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <input
        type="text"
        placeholder="Trip Name"
        className="w-full p-2 border rounded"
        value={trip}
        onChange={(e) => setTrip(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        className="w-full p-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Expense
      </button>
    </form>
  );
}*/