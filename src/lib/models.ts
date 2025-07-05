import mongoose, { Schema, Document, CallbackError } from "mongoose";
import {
  Transaction,
  Budget,
  TransactionCategory,
  TransactionType,
} from "./types";

export interface ITransaction extends Document {
  amount: number;
  description: string;
  category: (typeof TransactionCategory)[keyof typeof TransactionCategory];
  type: (typeof TransactionType)[keyof typeof TransactionType];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudget extends Document {
  category:
    | typeof TransactionCategory.FOOD
    | typeof TransactionCategory.TRANSPORTATION
    | typeof TransactionCategory.HOUSING
    | typeof TransactionCategory.UTILITIES
    | typeof TransactionCategory.ENTERTAINMENT
    | typeof TransactionCategory.HEALTHCARE
    | typeof TransactionCategory.SHOPPING
    | typeof TransactionCategory.EDUCATION
    | typeof TransactionCategory.TRAVEL
    | typeof TransactionCategory.OTHER_EXPENSE;
  amount: number;
  period: "monthly" | "yearly";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(TransactionCategory),
  },
  type: {
    type: String,
    required: true,
    enum: [TransactionType.INCOME, TransactionType.EXPENSE],
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BudgetSchema = new Schema<IBudget>({
  category: {
    type: String,
    required: true,
    enum: [
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
    ],
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  period: {
    type: String,
    required: true,
    enum: ["monthly", "yearly"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TransactionSchema.pre("save", function (next: (err?: CallbackError) => void) {
  this.updatedAt = new Date();
  next();
});

BudgetSchema.pre("save", function (next: (err?: CallbackError) => void) {
  this.updatedAt = new Date();
  next();
});

export const TransactionModel =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
export const BudgetModel =
  mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);

export const transactionDocToType = (doc: ITransaction): Transaction => ({
  id: (doc._id as mongoose.Types.ObjectId).toString(),
  amount: doc.amount,
  description: doc.description,
  category: doc.category,
  type: doc.type,
  date: doc.date.toISOString(),
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});

export const budgetDocToType = (doc: IBudget): Budget => ({
  id: (doc._id as mongoose.Types.ObjectId).toString(),
  category: doc.category,
  amount: doc.amount,
  period: doc.period,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});
