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
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "react-hot-toast";
import { createReview } from "@/lib/actions/review.actions";
import { Textarea } from "@/components/ui/textarea";
import { IReview } from "@/lib/database/models/review.model";
import { Loader2, User, Briefcase, Quote, ImageIcon } from "lucide-react";

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

const ReviewForm = ({ type }: ReviewFormProps) => {
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
    const loadingToast = toast.loading("Submitting your review...");
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

      toast.dismiss(loadingToast);
      toast.success(
        "Your review has been submitted. It will be displayed after verification.",
        { duration: 5000 }
      );
      form.reset();
      router.push(`/testimonials`);
      router.refresh();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Review submission failed. Please try again.");
      console.error("Review submission failed:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Quote className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Your Review
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
                    Your Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your or your company name"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Displayed next to your testimonial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Role / Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. CEO, Apex Tech or Director of Product"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Your job title and/or company.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  Your Testimonial
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience working with us, standout results, or what you loved most..."
                    {...field}
                    className="min-h-[140px] bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20 resize-y"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Minimum 10 characters. Genuine, specific feedback resonates most.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <ImageIcon className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Avatar / Logo
            </h3>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Upload Logo or Profile Image
                </FormLabel>
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Optional but recommended. Square images work best.
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
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Quote className="w-4 h-4" />
                Submit Review
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
