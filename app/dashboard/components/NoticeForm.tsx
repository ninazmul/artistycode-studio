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
import { addNotice } from "@/lib/actions/notice.actions";

export const noticeFormSchema = z.object({
  notice: z.string().min(15, "Notice must be at least 15 characters."),
});

const NoticeForm = ({ userId, type }: { userId: string; type: "Create" }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof noticeFormSchema>>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      notice: "",
    },
  });

  async function onSubmit(values: z.infer<typeof noticeFormSchema>) {

    try {
      if (type === "Create" && userId) {
        const newNotice = await addNotice({
          Notice: values.notice
        });

        if (newNotice) {
          form.reset();
          router.push(`/dashboard/notices`);
        }
      }
    } catch (error) {
      console.error("Notice uploading failed", error);
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
          name="notice"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Notice" {...field} className="input-field" />
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
          {form.formState.isSubmitting ? "Uploading..." : "Add Notice"}
        </Button>
      </form>
    </Form>
  );
};

export default NoticeForm;
