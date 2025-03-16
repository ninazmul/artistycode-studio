"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { transactionDefaultValues } from "@/constants";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { Textarea } from "@/components/ui/textarea";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/transaction.actions";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const categories = ["WebApps", "MobileApps", "Games", "Others"];

export const transactionFormSchema = z.object({
  date: z.date(),
  project: z.string().min(15, "Project Name must be at least 15 characters."),
  amount: z.string(),
  due_amount: z.string(),
  notes: z
    .string()
    .min(3, "Note must be at least 3 characters")
    .max(400, "Note must be less than 400 characters"),
  category: z.string().refine((val) => categories.includes(val), {
    message: "Invalid category selected.",
  }),
});

type TransactionFormProps = {
  userId: string;
  type: "Create" | "Update";
  transaction?: ITransaction;
  transactionId?: string;
};

const TransactionForm = ({
  userId,
  type,
  transaction,
  transactionId,
}: TransactionFormProps) => {
  const router = useRouter();

  // Determine initial form values
  const initialValues =
    transaction && type === "Update"
      ? {
          ...transaction,
        }
      : transactionDefaultValues;

  // Setup React Hook Form with Zod schema validation
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialValues,
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof transactionFormSchema>) => {
    try {
      // Create or update transaction
      if (type === "Create" && userId) {
        await createTransaction({
          date: values.date,
          project: values.project,
          amount: values.amount,
          due_amount: values.due_amount,
          notes: values.notes,
          category: values.category,
        });

        form.reset();
        router.push(`/dashboard/transactions`);
      } else if (type === "Update" && userId && transactionId) {
        await updateTransaction(transactionId, {
          date: values.date,
          project: values.project,
          amount: values.amount,
          due_amount: values.due_amount,
          notes: values.notes,
          category: values.category,
        });

        form.reset();
        router.push(`/dashboard/transactions`);
      }
    } catch (error) {
      console.error("Transaction operation failed:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <select {...field} className="input-field">
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center h-[54px] w-full overflow-hidden rounded-full px-4 py-2 input-field">
                  <Calendar />
                  <p className="ml-3 whitespace-nowrap">Date:</p>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="datePicker"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Field */}
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Project (e.g., Sales Management System...)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Amount (e.g., 0.00)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due_amount Field */}
        <FormField
          control={form.control}
          name="due_amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Due_amount (e.g., 0.00)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NOTES Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Notes"
                  {...field}
                  className="textarea rounded-2xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full bg-purple"
        >
          {form.formState.isSubmitting
            ? type === "Create"
              ? "Creating..."
              : "Updating..."
            : type === "Create"
            ? "Add Transaction"
            : "Update Transaction"}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
