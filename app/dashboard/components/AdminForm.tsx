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
import { createAdmin } from "@/lib/actions/admin.actions";

export const adminFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
});

const AdminForm = ({ userId, type }: { userId: string; type: "Create" }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof adminFormSchema>) {
    try {
      if (type === "Create" && userId) {
        const newAdmin = await createAdmin({
          Name: values.name,
          Email: values.email,
        });

        if (newAdmin) {
          form.reset();
          router.push(`/dashboard/admins`);
        }
      }
    } catch (error) {
      console.error("Admin creation failed", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Name" {...field} className="input-field" />
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
                <Input placeholder="Email" {...field} className="input-field" />
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
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Create Admin"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminForm;
