"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Transaction,
  TransactionType,
  CategoryDisplayNames,
} from "@/lib/types";

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: "income" | "expense";
}

// Color palette for categories
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#87ceeb",
  "#ffa07a",
  "#98fb98",
  "#f0e68c",
  "#dda0dd",
  "#ffb6c1",
  "#87cefa",
  "#90ee90",
  "#ffcc99",
];

export function CategoryPieChart({
  transactions,
  type,
}: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    const filteredTransactions = transactions.filter(
      (t) =>
        t.type ===
        (type === "income" ? TransactionType.INCOME : TransactionType.EXPENSE)
    );

    // Calculate totals by category
    filteredTransactions.forEach((transaction) => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });

    // Convert to array for chart
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name:
          CategoryDisplayNames[category as keyof typeof CategoryDisplayNames] ||
          category,
        value: amount,
        category,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, type]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
            ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "income" ? "Income" : "Expense"} Categories
          </CardTitle>
          <CardDescription>
            Breakdown of your {type === "income" ? "income" : "expenses"} by
            category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No {type === "income" ? "income" : "expense"} data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "income" ? "Income" : "Expense"} Categories
        </CardTitle>
        <CardDescription>
          Breakdown of your {type === "income" ? "income" : "expenses"} by
          category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium">
            Total {type === "income" ? "Income" : "Expenses"}: $
            {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {chartData.slice(0, 6).map((item, index) => (
              <div key={item.category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
