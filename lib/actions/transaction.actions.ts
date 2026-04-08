"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Transaction from "../database/models/transaction.model";
import { CreateTransactionParams } from "@/types";

export const createTransaction = async ({
  date,
  project,
  category,
  amount,
  due_amount,
  notes,
}: CreateTransactionParams) => {
  try {
    await connectToDatabase();

    const newAdmin = await Transaction.create({
      date,
      project,
      category,
      amount,
      due_amount,
      notes,
    });

    return JSON.parse(JSON.stringify(newAdmin));
  } catch (error) {
    handleError(error);
  }
};

export const getAllTransactions = async () => {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find().sort({ _id: -1 });

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    handleError(error);
  }
};

export const getTransactionById = async (transactionId: string) => {
  try {
    await connectToDatabase();

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return JSON.parse(JSON.stringify(transaction));
  } catch (error) {
    handleError(error);
  }
};

export const deleteTransaction = async (transactionId: string) => {
  try {
    await connectToDatabase();

    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      throw new Error("Transaction not found");
    }

    return { message: "Transaction deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const updateTransaction = async (
  transactionId: string,
  updateData: Partial<CreateTransactionParams>
) => {
  try {
    await connectToDatabase();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      throw new Error("Transaction not found");
    }

    return JSON.parse(JSON.stringify(updatedTransaction));
  } catch (error) {
    handleError(error);
  }
};
