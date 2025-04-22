

import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center">🌍 Abroad Budget Tracker</h1>
        <p className="text-center text-lg">Track your spending while studying or traveling abroad.</p>

        <AddExpenseForm />
        <ExpenseList />
      </div>
    </main>
  );
}
