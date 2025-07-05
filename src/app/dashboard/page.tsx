"use client";

import * as React from "react";
import { SectionCards } from "@/components/section-cards";
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
import { IconPlus, IconDatabase, IconLoader2 } from "@tabler/icons-react";
import { useTransactions, useBudgets } from "@/hooks/useApi";
import { toast } from "sonner";

import { Transaction, TransactionFormData, BudgetFormData } from "@/lib/types";

export default function Page() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const {
    budgets,
    loading: budgetsLoading,
    error: budgetsError,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      await addTransaction(formData);
      toast.success("Transaction added successfully!");
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditDialog(true);
  };

  const handleUpdateTransaction = async (
    id: string,
    formData: TransactionFormData
  ) => {
    try {
      await updateTransaction(id, formData);
      setEditingTransaction(null);
      toast.success("Transaction updated successfully!");
    } catch (error) {
      toast.error("Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleAddBudget = async (formData: BudgetFormData) => {
    try {
      await addBudget(formData);
      toast.success("Budget added successfully!");
    } catch (error) {
      toast.error("Failed to add budget");
    }
  };

  const handleUpdateBudget = async (id: string, formData: BudgetFormData) => {
    try {
      await updateBudget(id, formData);
      toast.success("Budget updated successfully!");
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success("Budget deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const handleSeedDatabase = async () => {
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Database seeded successfully!");
        // The useTransactions hook will automatically refetch
      } else {
        toast.error("Failed to seed database");
      }
    } catch (error) {
      toast.error("Failed to seed database");
    }
  };

  const isLoading = transactionsLoading || budgetsLoading;

  if (isLoading) {
    return (
        <SidebarInset>
          <div className="flex flex-1 flex-col items-center justify-center">
            <IconLoader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2 text-muted-foreground">
              Loading your financial data...
            </p>
          </div>
        </SidebarInset>
    );
  }

  if (transactionsError || budgetsError) {
    return (
        <div>
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <p className="text-destructive">
              Error: {transactionsError || budgetsError}
            </p>
            <Button onClick={handleSeedDatabase} variant="outline">
              <IconDatabase className="h-4 w-4 mr-2" />
              Seed Database
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div>
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex items-center justify-between px-4 lg:px-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSeedDatabase}
                    variant="outline"
                    size="sm"
                  >
                    <IconDatabase className="h-4 w-4 mr-2" />
                    Seed DB
                  </Button>
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
    </div>
  );
}
