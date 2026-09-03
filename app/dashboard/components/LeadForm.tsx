"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { createLead, updateLead } from "@/lib/actions/lead.actions";
import toast from "react-hot-toast";
import { Loader2, User, Mail, Building2, Activity, MessageSquare } from "lucide-react";

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
    const loadingToast = toast.loading(
      type === "Create" ? "Adding lead..." : "Updating lead..."
    );
    try {
      if (type === "Create") {
        const res = await createLead(values);
        if (res) {
          toast.dismiss(loadingToast);
          toast.success("Lead created successfully!");
          form.reset();
          if (onSuccess) onSuccess();
        } else {
          throw new Error("Failed to create lead.");
        }
      } else if (type === "Update" && lead?._id) {
        const res = await updateLead(lead._id, values);
        if (res) {
          toast.dismiss(loadingToast);
          toast.success("Lead updated successfully!");
          form.reset();
          if (onSuccess) onSuccess();
        } else {
          throw new Error("Failed to update lead.");
        }
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "An error occurred");
      console.error(error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Lead Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Full Name
                </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Jane Smith"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Contact person&apos;s full name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@company.com"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Primary contact email for outreach.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Company (Optional)
                </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company / Organization"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Company or organization the lead represents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Status
                </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl hover:bg-white/[0.05] transition-colors">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black-200 border-white/10 text-white rounded-xl">
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s} className="focus:bg-white/10 focus:text-white rounded-lg">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[11px] text-white/40">
                    Current stage of the lead in your pipeline.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <MessageSquare className="w-5 h-5 text-white/60" />
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
                  <MessageSquare className="w-3.5 h-3.5" />
                  Notes & Comments (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Call summary, interests, next steps..."
                    {...field}
                    className="min-h-[100px] bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20 resize-y"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Record any context, follow-up reminders, or details about this lead.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-semibold shadow-lg shadow-white/10 transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {type === "Create" ? "Adding..." : "Updating..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {type === "Create" ? "Add Lead" : "Update Lead"}
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LeadForm;
