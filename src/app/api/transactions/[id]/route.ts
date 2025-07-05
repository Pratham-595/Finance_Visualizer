import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { TransactionModel, transactionDocToType } from "@/lib/models";
import { transactionFormSchema } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = transactionFormSchema.parse(body);

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      params.id,
      {
        amount: validatedData.amount,
        description: validatedData.description,
        category: validatedData.category,
        type: validatedData.type,
        date: new Date(validatedData.date),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transaction: transactionDocToType(updatedTransaction),
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error("Error updating transaction:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deletedTransaction = await TransactionModel.findByIdAndDelete(
      params.id
    );

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
