import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { BudgetModel, budgetDocToType } from "@/lib/models";
import { budgetFormSchema } from "@/lib/types";

export async function GET() {
  try {
    await connectDB();

    const budgets = await BudgetModel.find({}).sort({ createdAt: -1 }).exec();

    const formattedBudgets = budgets.map(budgetDocToType);

    return NextResponse.json({ budgets: formattedBudgets });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate the request body
    const validatedData = budgetFormSchema.parse(body);

    const budget = new BudgetModel({
      category: validatedData.category,
      amount: validatedData.amount,
      period: validatedData.period,
    });

    const savedBudget = await budget.save();

    return NextResponse.json(
      {
        budget: budgetDocToType(savedBudget),
        message: "Budget created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating budget:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format", details: error.message },
        { status: 400 }
      );
    }

    // Handle duplicate category error
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === 11000
    ) {
      return NextResponse.json(
        { error: "Budget for this category already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
