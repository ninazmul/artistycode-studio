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
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { createLead, updateLead } from "@/lib/actions/lead.actions";
import toast from "react-hot-toast";

const statuses = ["Pending", "Emailed", "Replied"];

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Must be a valid email address."),
  company: z.string().optional(),
  status: z.string().refine((val) => statuses.includes(val), {
    message: "Invalid status selected.",
  }),
  notes: z.string().optional(),
});

type LeadFormProps = {
  type: "Create" | "Update";
  lead?: {
    _id: string;
    name: string;
    email: string;
    company?: string;
    status: string;
    notes?: string;
  };
  onSuccess?: () => void;
};

const LeadForm = ({ type, lead, onSuccess }: LeadFormProps) => {

  const initialValues =
    lead && type === "Update"
      ? {
          name: lead.name,
          email: lead.email,
          company: lead.company || "",
          status: lead.status || "Pending",
          notes: lead.notes || "",
        }
      : {
          name: "",
          email: "",
          company: "",
          status: "Pending",
          notes: "",
        };

  const form = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: z.infer<typeof leadFormSchema>) => {
    try {
      if (type === "Create") {
        const res = await createLead(values);
        if (res) {
          toast.success("Lead created successfully!");
          form.reset();
          if (onSuccess) onSuccess();
        } else {
          toast.error("Failed to create lead.");
        }
      } else if (type === "Update" && lead?._id) {
        const res = await updateLead(lead._id, values);
        if (res) {
          toast.success("Lead updated successfully!");
          form.reset();
          if (onSuccess) onSuccess();
        } else {
          toast.error("Failed to update lead.");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-white">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Full Name" {...field} className="input-field bg-black border-white/20 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Email Address" {...field} className="input-field bg-black border-white/20 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Field */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Company Name" {...field} className="input-field bg-black border-white/20 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border border-white/20 bg-black px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Notes / Comments"
                  {...field}
                  className="textarea rounded-2xl bg-black border-white/20 text-white min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-white text-black hover:bg-black hover:text-white border border-white/20 transition-all font-semibold"
        >
          {form.formState.isSubmitting
            ? type === "Create"
              ? "Creating..."
              : "Updating..."
            : type === "Create"
              ? "Add Lead"
              : "Update Lead"}
        </Button>
      </form>
    </Form>
  );
};

export default LeadForm;
