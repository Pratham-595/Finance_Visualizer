import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
  IconPigMoney,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction, TransactionType } from "@/lib/types";

interface SectionCardsProps {
  transactions: Transaction[];
}

export function SectionCards({ transactions }: SectionCardsProps) {
  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Calculate this month's data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate last month's data for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const lastMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  });

  const lastMonthIncome = lastMonthTransactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = lastMonthTransactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage changes
  const incomeChange =
    lastMonthIncome > 0
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : 0;
  const expenseChange =
    lastMonthExpenses > 0
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant={balance >= 0 ? "default" : "destructive"}>
              {balance >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {balance >= 0 ? "Positive" : "Negative"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconWallet className="size-4" />
            Current financial position
          </div>
          <div className="text-muted-foreground">Income minus expenses</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Income</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
            $
            {thisMonthIncome.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {incomeChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {incomeChange >= 0 ? "+" : ""}
              {incomeChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {incomeChange >= 0 ? "Income increased" : "Income decreased"} this
            month
            {incomeChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
            $
            {thisMonthExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {expenseChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {expenseChange >= 0 ? "+" : ""}
              {expenseChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {expenseChange >= 0 ? "Expenses increased" : "Expenses decreased"}{" "}
            this month
            {expenseChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Savings Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {thisMonthIncome > 0
              ? (
                  ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) *
                  100
                ).toFixed(1)
              : 0}
            %
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconPigMoney />
              Monthly
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconPigMoney className="size-4" />
            Percentage of income saved
          </div>
          <div className="text-muted-foreground">Income saved this month</div>
        </CardFooter>
      </Card>
    </div>
  );
}
