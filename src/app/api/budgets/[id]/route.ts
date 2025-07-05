import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { BudgetModel, budgetDocToType } from "@/lib/models";
import { budgetFormSchema } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const validatedData = budgetFormSchema.parse(body);

    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      id,
      {
        category: validatedData.category,
        amount: validatedData.amount,
        period: validatedData.period,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({
      budget: budgetDocToType(updatedBudget),
      message: "Budget updated successfully",
    });
  } catch (error) {
    console.error("Error updating budget:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const deletedBudget = await BudgetModel.findByIdAndDelete(id);

    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}