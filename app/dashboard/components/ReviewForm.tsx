"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "react-hot-toast";
import { createReview } from "@/lib/actions/review.actions";
import { Textarea } from "@/components/ui/textarea";
import { IReview } from "@/lib/database/models/review.model";

export const reviewFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  title: z.string().min(3, "Title must be at least 3 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  image: z.string(),
});

type ReviewFormProps = {
  type: "Create";
  review?: IReview;
  reviewId?: string;
};

const ReviewForm = ({ type, review, reviewId }: ReviewFormProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: "",
      title: "",
      quote: "",
      image: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    try {
      let uploadedImageUrl = values.image;

      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) {
          throw new Error("Image upload failed. Please try again.");
        }
        uploadedImageUrl = uploadedImages[0].url;
      }

      await createReview({
        name: values.name,
        title: values.title,
        quote: values.quote,
        image: uploadedImageUrl,
        verified: false,
      });

      form.reset();
      toast.success(
        "Your review has been submitted. It will be displayed after verification."
      );
      router.push(`/testimonials`);
    } catch (error) {
      console.error("Review submission failed:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Enter your or your company name"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Enter your title (e.g., Director of ...)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Write your review here..."
                  {...field}
                  className="textarea rounded-2xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Upload Logo or Profile Image</FormLabel>
              <FormControl className="h-72">
                <FileUploader
                  onFieldChange={field.onChange}
                  imageUrl={field.value}
                  setFiles={setFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full bg-purple"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
