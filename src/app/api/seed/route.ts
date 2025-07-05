import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { TransactionModel } from "@/lib/models";
import { TransactionCategory, TransactionType } from "@/lib/types";

// Function to generate random transactions for the past 6 months
function generateSampleData() {
  const transactions = [];
  const now = new Date();
  
  // Income transactions (monthly salary, freelance, etc.)
  for (let month = 0; month < 6; month++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
    
    // Monthly salary
    transactions.push({
      amount: 3500 + Math.random() * 500, // $3500-4000
      description: "Monthly Salary",
      category: TransactionCategory.SALARY,
      type: TransactionType.INCOME,
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
    });
    
    // Freelance income (random)
    if (Math.random() > 0.4) {
      transactions.push({
        amount: 200 + Math.random() * 800, // $200-1000
        description: "Freelance Project",
        category: TransactionCategory.FREELANCE,
        type: TransactionType.INCOME,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 10 + Math.random() * 15),
      });
    }
    
    // Investment income
    if (Math.random() > 0.6) {
      transactions.push({
        amount: 100 + Math.random() * 300, // $100-400
        description: "Investment Dividend",
        category: TransactionCategory.INVESTMENT,
        type: TransactionType.INCOME,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 15 + Math.random() * 10),
      });
    }
  }
  
  // Expense transactions (varied throughout months)
  for (let month = 0; month < 6; month++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    
    // Fixed monthly expenses
    transactions.push({
      amount: 1200 + Math.random() * 100, // $1200-1300
      description: "Monthly Rent",
      category: TransactionCategory.HOUSING,
      type: TransactionType.EXPENSE,
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
    });
    
    // Utilities
    transactions.push({
      amount: 80 + Math.random() * 40, // $80-120
      description: "Electric Bill",
      category: TransactionCategory.UTILITIES,
      type: TransactionType.EXPENSE,
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 5 + Math.random() * 5),
    });
    
    transactions.push({
      amount: 50 + Math.random() * 20, // $50-70
      description: "Internet Bill",
      category: TransactionCategory.UTILITIES,
      type: TransactionType.EXPENSE,
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 10 + Math.random() * 5),
    });
    
    // Food expenses (multiple per month)
    const foodTransactions = 8 + Math.random() * 12; // 8-20 food transactions per month
    for (let i = 0; i < foodTransactions; i++) {
      const foodDescriptions = ["Grocery Shopping", "Restaurant", "Coffee Shop", "Fast Food", "Lunch", "Dinner"];
      transactions.push({
        amount: 15 + Math.random() * 85, // $15-100
        description: foodDescriptions[Math.floor(Math.random() * foodDescriptions.length)],
        category: TransactionCategory.FOOD,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
    
    // Transportation
    const transportationCount = 3 + Math.random() * 5; // 3-8 per month
    for (let i = 0; i < transportationCount; i++) {
      const transportDescriptions = ["Gas Station", "Bus Fare", "Uber", "Parking", "Car Maintenance"];
      transactions.push({
        amount: 20 + Math.random() * 80, // $20-100
        description: transportDescriptions[Math.floor(Math.random() * transportDescriptions.length)],
        category: TransactionCategory.TRANSPORTATION,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
    
    // Entertainment
    const entertainmentCount = 2 + Math.random() * 6; // 2-8 per month
    for (let i = 0; i < entertainmentCount; i++) {
      const entertainmentDescriptions = ["Movie Tickets", "Concert", "Streaming Service", "Games", "Books"];
      transactions.push({
        amount: 10 + Math.random() * 90, // $10-100
        description: entertainmentDescriptions[Math.floor(Math.random() * entertainmentDescriptions.length)],
        category: TransactionCategory.ENTERTAINMENT,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
    
    // Shopping
    const shoppingCount = 1 + Math.random() * 4; // 1-5 per month
    for (let i = 0; i < shoppingCount; i++) {
      const shoppingDescriptions = ["Clothing Store", "Electronics", "Home Goods", "Online Shopping", "Department Store"];
      transactions.push({
        amount: 30 + Math.random() * 170, // $30-200
        description: shoppingDescriptions[Math.floor(Math.random() * shoppingDescriptions.length)],
        category: TransactionCategory.SHOPPING,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
    
    // Healthcare
    if (Math.random() > 0.7) { // 30% chance per month
      const healthcareDescriptions = ["Doctor Visit", "Pharmacy", "Dentist", "Health Insurance"];
      transactions.push({
        amount: 50 + Math.random() * 200, // $50-250
        description: healthcareDescriptions[Math.floor(Math.random() * healthcareDescriptions.length)],
        category: TransactionCategory.HEALTHCARE,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
    
    // Education
    if (Math.random() > 0.8) { // 20% chance per month
      const educationDescriptions = ["Online Course", "Books", "Certification", "Workshop"];
      transactions.push({
        amount: 25 + Math.random() * 175, // $25-200
        description: educationDescriptions[Math.floor(Math.random() * educationDescriptions.length)],
        category: TransactionCategory.EDUCATION,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
    
    // Travel
    if (Math.random() > 0.85) { // 15% chance per month
      const travelDescriptions = ["Flight", "Hotel", "Vacation", "Business Trip"];
      transactions.push({
        amount: 200 + Math.random() * 800, // $200-1000
        description: travelDescriptions[Math.floor(Math.random() * travelDescriptions.length)],
        category: TransactionCategory.TRAVEL,
        type: TransactionType.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 + Math.random() * daysInMonth),
      });
    }
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function POST() {
  try {
    await connectDB();

    // Clear existing transactions
    await TransactionModel.deleteMany({});

    // Generate sample data for the past 6 months
    const sampleTransactions = generateSampleData();
    
    // Transform data for MongoDB
    const transformedTransactions = sampleTransactions.map((transaction) => ({
      amount: Math.round(transaction.amount * 100) / 100, // Round to 2 decimal places
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const insertedTransactions = await TransactionModel.insertMany(
      transformedTransactions
    );

    return NextResponse.json({
      message: "Database seeded successfully with 6 months of sample data",
      count: insertedTransactions.length,
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString(),
        to: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
