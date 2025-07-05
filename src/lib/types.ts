import { z } from "zod";

// Transaction type enum
export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

// Transaction categories
export const TransactionCategory = {
  // Income categories
  SALARY: "salary",
  FREELANCE: "freelance",
  INVESTMENT: "investment",
  BUSINESS: "business",
  OTHER_INCOME: "other_income",

  // Expense categories
  FOOD: "food",
  TRANSPORTATION: "transportation",
  HOUSING: "housing",
  UTILITIES: "utilities",
  ENTERTAINMENT: "entertainment",
  HEALTHCARE: "healthcare",
  SHOPPING: "shopping",
  EDUCATION: "education",
  TRAVEL: "travel",
  OTHER_EXPENSE: "other_expense",
} as const;

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.enum([
    TransactionCategory.SALARY,
    TransactionCategory.FREELANCE,
    TransactionCategory.INVESTMENT,
    TransactionCategory.BUSINESS,
    TransactionCategory.OTHER_INCOME,
    TransactionCategory.FOOD,
    TransactionCategory.TRANSPORTATION,
    TransactionCategory.HOUSING,
    TransactionCategory.UTILITIES,
    TransactionCategory.ENTERTAINMENT,
    TransactionCategory.HEALTHCARE,
    TransactionCategory.SHOPPING,
    TransactionCategory.EDUCATION,
    TransactionCategory.TRAVEL,
    TransactionCategory.OTHER_EXPENSE,
  ]),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
  date: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// Category display names
export const CategoryDisplayNames = {
  [TransactionCategory.SALARY]: "Salary",
  [TransactionCategory.FREELANCE]: "Freelance",
  [TransactionCategory.INVESTMENT]: "Investment",
  [TransactionCategory.BUSINESS]: "Business",
  [TransactionCategory.OTHER_INCOME]: "Other Income",
  [TransactionCategory.FOOD]: "Food & Dining",
  [TransactionCategory.TRANSPORTATION]: "Transportation",
  [TransactionCategory.HOUSING]: "Housing",
  [TransactionCategory.UTILITIES]: "Utilities",
  [TransactionCategory.ENTERTAINMENT]: "Entertainment",
  [TransactionCategory.HEALTHCARE]: "Healthcare",
  [TransactionCategory.SHOPPING]: "Shopping",
  [TransactionCategory.EDUCATION]: "Education",
  [TransactionCategory.TRAVEL]: "Travel",
  [TransactionCategory.OTHER_EXPENSE]: "Other Expenses",
} as const;

// Form schema for adding/editing transactions
export const transactionFormSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z
    .enum([
      TransactionCategory.SALARY,
      TransactionCategory.FREELANCE,
      TransactionCategory.INVESTMENT,
      TransactionCategory.BUSINESS,
      TransactionCategory.OTHER_INCOME,
      TransactionCategory.FOOD,
      TransactionCategory.TRANSPORTATION,
      TransactionCategory.HOUSING,
      TransactionCategory.UTILITIES,
      TransactionCategory.ENTERTAINMENT,
      TransactionCategory.HEALTHCARE,
      TransactionCategory.SHOPPING,
      TransactionCategory.EDUCATION,
      TransactionCategory.TRAVEL,
      TransactionCategory.OTHER_EXPENSE,
    ])
    .optional(),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

// Get categories by type
export const getCategoriesByType = (type: string) => {
  if (type === TransactionType.INCOME) {
    return [
      TransactionCategory.SALARY,
      TransactionCategory.FREELANCE,
      TransactionCategory.INVESTMENT,
      TransactionCategory.BUSINESS,
      TransactionCategory.OTHER_INCOME,
    ];
  } else {
    return [
      TransactionCategory.FOOD,
      TransactionCategory.TRANSPORTATION,
      TransactionCategory.HOUSING,
      TransactionCategory.UTILITIES,
      TransactionCategory.ENTERTAINMENT,
      TransactionCategory.HEALTHCARE,
      TransactionCategory.SHOPPING,
      TransactionCategory.EDUCATION,
      TransactionCategory.TRAVEL,
      TransactionCategory.OTHER_EXPENSE,
    ];
  }
};

// Budget schema
export const budgetSchema = z.object({
  id: z.string(),
  category: z.enum([
    TransactionCategory.FOOD,
    TransactionCategory.TRANSPORTATION,
    TransactionCategory.HOUSING,
    TransactionCategory.UTILITIES,
    TransactionCategory.ENTERTAINMENT,
    TransactionCategory.HEALTHCARE,
    TransactionCategory.SHOPPING,
    TransactionCategory.EDUCATION,
    TransactionCategory.TRAVEL,
    TransactionCategory.OTHER_EXPENSE,
  ]),
  amount: z.number().positive(),
  period: z.enum(["monthly", "yearly"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Budget = z.infer<typeof budgetSchema>;

// Budget form schema
export const budgetFormSchema = z.object({
  category: z.enum([
    TransactionCategory.FOOD,
    TransactionCategory.TRANSPORTATION,
    TransactionCategory.HOUSING,
    TransactionCategory.UTILITIES,
    TransactionCategory.ENTERTAINMENT,
    TransactionCategory.HEALTHCARE,
    TransactionCategory.SHOPPING,
    TransactionCategory.EDUCATION,
    TransactionCategory.TRAVEL,
    TransactionCategory.OTHER_EXPENSE,
  ]),
  amount: z.number().positive("Amount must be positive"),
  period: z.enum(["monthly", "yearly"]),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;

// Budget analysis type
export type BudgetAnalysis = {
  category: string;
  budgetAmount: number;
  actualAmount: number;
  difference: number;
  percentage: number;
  status: "under" | "over" | "on-track";
};
