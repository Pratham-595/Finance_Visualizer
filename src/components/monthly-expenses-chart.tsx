"use client";

import { useMemo } from "react";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Transaction, TransactionType } from "@/lib/types";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MonthlyExpensesChart({
  transactions,
}: MonthlyExpensesChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    // Get last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(startOfMonth(new Date()), i);
      const monthKey = format(date, "yyyy-MM");
      const monthLabel = format(date, "MMM yyyy");
      months.push({ key: monthKey, label: monthLabel });
      monthlyData[monthKey] = 0;
    }

    // Calculate expenses for each month
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthKey = format(date, "yyyy-MM");
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey] += transaction.amount;
        }
      });

    // Format data for chart
    return months.map((month) => ({
      month: month.label,
      expenses: monthlyData[month.key],
    }));
  }, [transactions]);

  const totalExpenses = chartData.reduce((sum, data) => sum + data.expenses, 0);
  const averageExpenses = totalExpenses / chartData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Your spending over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Expenses",
                  ]}
                />
              }
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Average: $
            {averageExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div>
            Total: $
            {totalExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
