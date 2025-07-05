import {
  Transaction,
  TransactionFormData,
  Budget,
  BudgetFormData,
} from "./types";

const API_BASE_URL = "/api";

// Transaction API functions
export const transactionAPI = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data = await response.json();
    return data.transactions || data;
  },

  // Create a new transaction
  create: async (transaction: TransactionFormData): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Failed to create transaction");
    }
    const data = await response.json();
    return data.transaction || data;
  },

  // Update a transaction
  update: async (
    id: string,
    transaction: TransactionFormData
  ): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }
    const data = await response.json();
    return data.transaction || data;
  },

  // Delete a transaction
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
  },
};

// Budget API functions
export const budgetAPI = {
  // Get all budgets
  getAll: async (): Promise<Budget[]> => {
    const response = await fetch(`${API_BASE_URL}/budgets`);
    if (!response.ok) {
      throw new Error("Failed to fetch budgets");
    }
    const data = await response.json();
    return data.budgets || data;
  },

  // Create a new budget
  create: async (budget: BudgetFormData): Promise<Budget> => {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    });
    if (!response.ok) {
      throw new Error("Failed to create budget");
    }
    const data = await response.json();
    return data.budget || data;
  },

  // Update a budget
  update: async (id: string, budget: BudgetFormData): Promise<Budget> => {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    });
    if (!response.ok) {
      throw new Error("Failed to update budget");
    }
    const data = await response.json();
    return data.budget || data;
  },

  // Delete a budget
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }
  },
};
