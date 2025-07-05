"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Transaction,
  Budget,
  BudgetAnalysis,
  TransactionType,
  CategoryDisplayNames,
} from "@/lib/types";

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetComparisonChart({
  transactions,
  budgets,
}: BudgetComparisonChartProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const budgetAnalysis = useMemo(() => {
    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.type === TransactionType.EXPENSE
      );
    });

    const categoryExpenses: { [key: string]: number } = {};

    thisMonthTransactions.forEach((transaction) => {
      if (categoryExpenses[transaction.category]) {
        categoryExpenses[transaction.category] += transaction.amount;
      } else {
        categoryExpenses[transaction.category] = transaction.amount;
      }
    });

    const analysis: BudgetAnalysis[] = budgets.map((budget) => {
      const actualAmount = categoryExpenses[budget.category] || 0;
      const budgetAmount =
        budget.period === "yearly" ? budget.amount / 12 : budget.amount;
      const difference = actualAmount - budgetAmount;
      const percentage =
        budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;

      let status: "under" | "over" | "on-track" = "on-track";
      if (percentage < 90) status = "under";
      else if (percentage > 110) status = "over";

      return {
        category: budget.category,
        budgetAmount,
        actualAmount,
        difference,
        percentage,
        status,
      };
    });

    return analysis.sort((a, b) => b.budgetAmount - a.budgetAmount);
  }, [transactions, budgets, currentMonth, currentYear]);

  const chartData = budgetAnalysis.map((item) => ({
    category:
      CategoryDisplayNames[item.category as keyof typeof CategoryDisplayNames],
    budget: item.budgetAmount,
    actual: item.actualAmount,
    categoryKey: item.category,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budget =
        payload.find((p: any) => p.dataKey === "budget")?.value || 0;
      const actual =
        payload.find((p: any) => p.dataKey === "actual")?.value || 0;
      const percentage = budget > 0 ? (actual / budget) * 100 : 0;

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            Budget: $
            {budget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-600">
            Actual: $
            {actual.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage.toFixed(1)}% of budget used
          </p>
        </div>
      );
    }
    return null;
  };

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>
            Compare your actual spending against your budgets for{" "}
            {format(new Date(), "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No budgets set yet. Create your first budget to see the comparison.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>
            Compare your actual spending against your budgets for{" "}
            {format(new Date(), "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                <Bar dataKey="actual" fill="#10b981" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>
            Detailed breakdown of your budget performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetAnalysis.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {
                      CategoryDisplayNames[
                        item.category as keyof typeof CategoryDisplayNames
                      ]
                    }
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === "under"
                          ? "default"
                          : item.status === "over"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {item.status === "under"
                        ? "Under Budget"
                        : item.status === "over"
                        ? "Over Budget"
                        : "On Track"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.min(item.percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    $
                    {item.actualAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    spent
                  </span>
                  <span>
                    $
                    {item.budgetAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    budget
                  </span>
                </div>
                {item.difference !== 0 && (
                  <div className="text-sm">
                    {item.difference > 0 ? (
                      <span className="text-red-600">
                        $
                        {Math.abs(item.difference).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        over budget
                      </span>
                    ) : (
                      <span className="text-green-600">
                        $
                        {Math.abs(item.difference).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        under budget
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
