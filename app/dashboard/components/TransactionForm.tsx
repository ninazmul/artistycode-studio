"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { transactionDefaultValues } from "@/constants";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { Textarea } from "@/components/ui/textarea";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/transaction.actions";
import { Calendar, FolderKanban, DollarSign, AlignLeft, ArrowDownUp, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const categories = [
  "WebApps",
  "MobileApps",
  "Games",
  "Reserve",
  "Spend",
  "Others",
];

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
  onSuccess?: () => void;
  withDialog?: { buttonText?: string; title?: string; description?: string };
};

const TransactionForm = ({
  userId,
  type,
  transaction,
  transactionId,
  onSuccess,
  withDialog,
}: TransactionFormProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const initialValues =
    transaction && type === "Update"
      ? {
        ...transaction,
      }
      : transactionDefaultValues;

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: z.infer<typeof transactionFormSchema>) => {
    const loadingToast = toast.loading(
      type === "Create" ? "Recording transaction..." : "Updating transaction..."
    );
    try {
      if (type === "Create" && userId) {
        await createTransaction({
          date: values.date,
          project: values.project,
          amount: values.amount,
          due_amount: values.due_amount,
          notes: values.notes,
          category: values.category,
        });

        toast.dismiss(loadingToast);
        toast.success("Transaction recorded successfully!");
        form.reset();
        if (onSuccess) onSuccess();
        if (withDialog) setDialogOpen(false);
        router.push(`/dashboard/transactions`);
        router.refresh();
      } else if (type === "Update" && userId && transactionId) {
        await updateTransaction(transactionId, {
          date: values.date,
          project: values.project,
          amount: values.amount,
          due_amount: values.due_amount,
          notes: values.notes,
          category: values.category,
        });

        toast.dismiss(loadingToast);
        toast.success("Transaction updated successfully!");
        form.reset();
        if (onSuccess) onSuccess();
        if (withDialog) setDialogOpen(false);
        router.push(`/dashboard/transactions`);
        router.refresh();
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Transaction operation failed. Please try again.");
      console.error("Transaction operation failed:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <ArrowDownUp className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Transaction Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5" />
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl hover:bg-white/[0.05] transition-colors">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black-200 border-white/10 text-white rounded-xl">
                      {categories.map((tz) => (
                        <SelectItem key={tz} value={tz} className="focus:bg-white/10 focus:text-white rounded-lg">
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[11px] text-white/40">
                    Income category or expense type.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Date & Time
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center h-11 w-full rounded-xl px-4 bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors">
                      <Calendar className="w-4 h-4 text-white/50 shrink-0" />
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        timeInputLabel="Time:"
                        showTimeSelect
                        dateFormat="MMM d, yyyy h:mm aa"
                        wrapperClassName="datePicker ml-3 w-full"
                        className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-white/30"
                        placeholderText="Select date and time"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    When the transaction occurred or is due.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <FolderKanban className="w-3.5 h-3.5" />
                  Project / Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Q1 Retainer - Apex Global Tech Ltd (Invoice #1042)"
                    {...field}
                    className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Minimum 15 characters. Include project name and reference.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Paid Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 2500.00"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Amount received / paid so far.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_amount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Due / Outstanding
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 1500.00"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Remaining balance pending. 0 if fully paid.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <AlignLeft className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Notes
            </h3>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" />
                  Transaction Notes
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Payment method, invoice number, client reference, or any additional context..."
                    {...field}
                    className="min-h-[100px] bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20 resize-y"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  3–400 characters. Captures context for your records.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isSubmitting}
            onClick={() => router.back()}
            className="flex-1 h-12 border-white/10 text-white/70 hover:bg-white/5 hover:text-white rounded-xl font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="flex-1 h-12 bg-white text-black hover:bg-white/90 rounded-xl font-semibold shadow-lg shadow-white/10 transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {type === "Create" ? "Recording..." : "Updating..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {type === "Create" ? "Add Transaction" : "Update Transaction"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (withDialog) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
            <Plus className="w-4 h-4" />
            {withDialog.buttonText || "Add Transaction"}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              {withDialog.title || "Add Transaction"}
            </DialogTitle>
            <p className="text-white/40 text-sm mt-1">
              {withDialog.description || "Fill out all transaction details carefully."}
            </p>
          </DialogHeader>
          <div className="mt-4">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
};

export default TransactionForm;
