"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { TransactionsTable } from "@/components/transactions-table";
import { MonthlyExpensesChart } from "@/components/monthly-expenses-chart";
import { CategoryPieChart } from "@/components/category-pie-chart";
import { BudgetComparisonChart } from "@/components/budget-comparison-chart";
import { SpendingInsights } from "@/components/spending-insights";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { EditTransactionDialog } from "@/components/edit-transaction-dialog";
import { BudgetManagementDialog } from "@/components/budget-management-dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPlus } from "@tabler/icons-react";

import transactionsData from "./transactions.json";
import {
  Transaction,
  TransactionFormData,
  Budget,
  BudgetFormData,
} from "@/lib/types";

export default function Page() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(
    transactionsData as Transaction[]
  );
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);

  const handleAddTransaction = (formData: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      amount: formData.amount,
      description: formData.description,
      category: formData.category!,
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditDialog(true);
  };

  const handleUpdateTransaction = (
    id: string,
    formData: TransactionFormData
  ) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              amount: formData.amount,
              description: formData.description,
              category: formData.category!,
              type: formData.type,
              date: new Date(formData.date).toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : transaction
      )
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  };

  const handleAddBudget = (formData: BudgetFormData) => {
    const newBudget: Budget = {
      id: (budgets.length + 1).toString(),
      category: formData.category,
      amount: formData.amount,
      period: formData.period,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBudgets((prev) => [...prev, newBudget]);
  };

  const handleUpdateBudget = (id: string, formData: BudgetFormData) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === id
          ? {
              ...budget,
              category: formData.category,
              amount: formData.amount,
              period: formData.period,
              updatedAt: new Date().toISOString(),
            }
          : budget
      )
    );
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex items-center justify-between px-4 lg:px-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                  <BudgetManagementDialog
                    budgets={budgets}
                    onAddBudget={handleAddBudget}
                    onUpdateBudget={handleUpdateBudget}
                    onDeleteBudget={handleDeleteBudget}
                  />
                  <Button onClick={() => setShowAddDialog(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              </div>

              <SectionCards transactions={transactions} />

              <Tabs defaultValue="overview" className="px-4 lg:px-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="budgets">Budgets</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <MonthlyExpensesChart transactions={transactions} />
                    <CategoryPieChart
                      transactions={transactions}
                      type="expense"
                    />
                  </div>
                  <SpendingInsights
                    transactions={transactions}
                    budgets={budgets}
                  />
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <CategoryPieChart
                      transactions={transactions}
                      type="income"
                    />
                    <CategoryPieChart
                      transactions={transactions}
                      type="expense"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="budgets" className="space-y-4">
                  <BudgetComparisonChart
                    transactions={transactions}
                    budgets={budgets}
                  />
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <TransactionsTable
                    data={transactions}
                    onAddTransaction={() => setShowAddDialog(true)}
                    onEditTransaction={handleEditTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>

      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddTransaction}
      />

      <EditTransactionDialog
        transaction={editingTransaction}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleUpdateTransaction}
      />
    </SidebarProvider>
  );
}
