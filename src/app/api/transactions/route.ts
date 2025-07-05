import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { TransactionModel, transactionDocToType } from "@/lib/models";
import { transactionFormSchema } from "@/lib/types";

export async function GET() {
  try {
    await connectDB();

    const transactions = await TransactionModel.find({})
      .sort({ createdAt: -1 })
      .exec();

    const formattedTransactions = transactions.map(transactionDocToType);

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate the request body
    const validatedData = transactionFormSchema.parse(body);

    const transaction = new TransactionModel({
      amount: validatedData.amount,
      description: validatedData.description,
      category: validatedData.category,
      type: validatedData.type,
      date: new Date(validatedData.date),
    });

    const savedTransaction = await transaction.save();

    return NextResponse.json(
      {
        transaction: transactionDocToType(savedTransaction),
        message: "Transaction created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data format", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
