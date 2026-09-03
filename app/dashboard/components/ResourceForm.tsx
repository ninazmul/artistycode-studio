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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { FileUploader } from "@/components/FileUploader";
import { resourceDefaultValues } from "@/constants";
import { IResource } from "@/lib/database/models/resource.model";
import { createResource, updateResource } from "@/lib/actions/resource.actions";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import {
  Loader2,
  Package,
  Type,
  AlignLeft,
  Layers,
  Link,
  ImageIcon,
  DollarSign,
  Ticket,
} from "lucide-react";

const categories = [
  "WebApps",
  "MobileApps",
  "Games",
  "WordPress",
  "CMS Themes",
  "UI Templates",
  "Other Scripts",
];

export const resourceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters."),
  stack: z.string().min(3, "Stack must be at least 3 characters."),
  image: z.string(),
  url: z.string().url("Must be a valid URL."),
  file: z.string().url("Must be a valid URL."),
  price: z.string(),
  isFree: z.boolean(),
  category: z.string().refine((val) => categories.includes(val), {
    message: "Invalid category selected.",
  }),
  author: z.string(),
});

type ResourceFormProps = {
  userId: string;
  type: "Create" | "Update";
  resource?: IResource;
  resourceId?: string;
};

const ResourceForm = ({
  userId,
  type,
  resource,
  resourceId,
}: ResourceFormProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const initialValues =
    resource && type === "Update"
      ? {
          ...resource,
        }
      : resourceDefaultValues;

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof resourceFormSchema>>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: initialValues,
  });

  const isFree = form.watch("isFree");

  const onSubmit = async (values: z.infer<typeof resourceFormSchema>) => {
    const loadingToast = toast.loading(
      type === "Create" ? "Creating resource..." : "Updating resource..."
    );
    try {
      let uploadedImageUrl = values.image;

      if (files.length > 0) {
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) {
          throw new Error("Image upload failed. Please try again.");
        }

        uploadedImageUrl = uploadedImages[0].url;
      }

      if (type === "Create" && userId) {
        await createResource({
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          file: values.file,
          price: values.isFree ? "0" : values.price,
          isFree: values.isFree,
          category: values.category,
          author: userId,
        });

        toast.dismiss(loadingToast);
        toast.success("Resource created successfully!");
        form.reset();
        router.push(`/dashboard/resources`);
        router.refresh();
      } else if (type === "Update" && userId && resourceId) {
        await updateResource(resourceId, {
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          category: values.category,
          author: userId,
        });

        toast.dismiss(loadingToast);
        toast.success("Resource updated successfully!");
        form.reset();
        router.push(`/dashboard/resources`);
        router.refresh();
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Resource operation failed. Please try again.");
      console.error("Resource operation failed:", error);
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
            <Package className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Resource Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
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
                    Select the type of digital resource.
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
                    <Type className="w-3.5 h-3.5" />
                    Resource Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Premium SaaS Starter Kit"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    A clear, marketable title for the listing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe features, what's included, and key benefits..."
                    {...field}
                    className="min-h-[120px] bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20 resize-y"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Minimum 15 characters. Sell the value — features, files, use cases.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stack"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Tech Stack
              </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. React 19, TypeScript, Tailwind, Prisma, Postgres"
                    {...field}
                    className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Comma-separated technologies used in the resource.
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
              Preview & Media
            </h3>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Cover Image
                </FormLabel>
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Thumbnail shown in marketplace listings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" />
                  Live Demo URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://demo.example.com"
                    {...field}
                    className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Preview or landing page for the resource.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Download / Source File URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://download.example.com/file.zip"
                    {...field}
                    className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Direct link to the deliverable files.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <DollarSign className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Pricing
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-end gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Price (USD)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 29.99"
                      disabled={isFree}
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20 disabled:opacity-50"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Leave at 0 and check &quot;Free&quot; to offer at no cost.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5 mb-0">
                    &nbsp;
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3 px-4 h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                      <Checkbox
                        id="isFree"
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        className="h-5 w-5 border-2 border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor="isFree"
                        className="text-sm font-medium text-white/80 cursor-pointer select-none flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4 text-white/60" />
                        Free Resource
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                {type === "Create" ? "Creating..." : "Updating..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {type === "Create" ? "Add Resource" : "Update Resource"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResourceForm;
