"use client";

import { useMemo } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconTarget,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Transaction,
  Budget,
  TransactionType,
  CategoryDisplayNames,
} from "@/lib/types";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({
  transactions,
  budgets,
}: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const today = new Date();

    // This month's transactions
    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.type === TransactionType.EXPENSE
      );
    });

    // Last month's transactions
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear &&
        t.type === TransactionType.EXPENSE
      );
    });

    // Calculate spending patterns
    const thisMonthTotal = thisMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const lastMonthTotal = lastMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const spendingChange =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    // Category analysis
    const categorySpending: { [key: string]: number } = {};
    thisMonthTransactions.forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + t.amount;
    });

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        name: CategoryDisplayNames[
          category as keyof typeof CategoryDisplayNames
        ],
      }));

    // Daily average
    const daysInMonth = endOfMonth(
      new Date(currentYear, currentMonth)
    ).getDate();
    const currentDay = today.getDate();
    const dailyAverage = thisMonthTotal / currentDay;
    const projectedMonthly = dailyAverage * daysInMonth;

    // Budget warnings
    const budgetWarnings = budgets
      .map((budget) => {
        const spent = categorySpending[budget.category] || 0;
        const budgetAmount =
          budget.period === "yearly" ? budget.amount / 12 : budget.amount;
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

        return {
          category: budget.category,
          name: CategoryDisplayNames[
            budget.category as keyof typeof CategoryDisplayNames
          ],
          spent,
          budget: budgetAmount,
          percentage,
          isWarning: percentage > 80,
          isOver: percentage > 100,
        };
      })
      .filter((b) => b.isWarning);

    // Recent high expenses
    const highExpenses = thisMonthTransactions
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .filter((t) => t.amount > 100);

    return {
      thisMonthTotal,
      lastMonthTotal,
      spendingChange,
      topCategories,
      dailyAverage,
      projectedMonthly,
      budgetWarnings,
      highExpenses,
    };
  }, [transactions, budgets]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            Spending Trends
          </CardTitle>
          <CardDescription>
            Monthly spending analysis and projections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">
                $
                {insights.thisMonthTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="text-sm text-muted-foreground">This month</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                $
                {insights.projectedMonthly.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                Projected total
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={insights.spendingChange > 0 ? "destructive" : "default"}
            >
              {insights.spendingChange > 0 ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {insights.spendingChange > 0 ? "+" : ""}
              {insights.spendingChange.toFixed(1)}%
            </Badge>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Daily Average</div>
            <div className="text-lg font-semibold">
              $
              {insights.dailyAverage.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTarget className="h-5 w-5" />
            Top Categories
          </CardTitle>
          <CardDescription>
            Your biggest spending categories this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topCategories.map((category, index) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <span className="text-sm font-semibold">
                  $
                  {category.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
            {insights.topCategories.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No expenses this month yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {insights.budgetWarnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-yellow-500" />
              Budget Alerts
            </CardTitle>
            <CardDescription>
              Categories approaching or exceeding budget limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.budgetWarnings.map((warning) => (
                <div
                  key={warning.category}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{warning.name}</div>
                    <div className="text-sm text-muted-foreground">
                      $
                      {warning.spent.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      of $
                      {warning.budget.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <Badge variant={warning.isOver ? "destructive" : "secondary"}>
                    {warning.percentage.toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {insights.highExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent High Expenses</CardTitle>
            <CardDescription>Notable transactions this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.highExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {
                        CategoryDisplayNames[
                          expense.category as keyof typeof CategoryDisplayNames
                        ]
                      }{" "}
                      • {format(new Date(expense.date), "MMM dd")}
                    </div>
                  </div>
                  <span className="font-semibold text-red-600">
                    $
                    {expense.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
