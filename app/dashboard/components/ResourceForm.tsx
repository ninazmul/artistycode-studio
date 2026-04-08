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
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { FileUploader } from "@/components/FileUploader";
import { resourceDefaultValues } from "@/constants";
import { IResource } from "@/lib/database/models/resource.model";
import { createResource, updateResource } from "@/lib/actions/resource.actions";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Determine initial form values
  const initialValues =
    resource && type === "Update"
      ? {
          ...resource,
        }
      : resourceDefaultValues;

  const { startUpload } = useUploadThing("imageUploader");

  // Setup React Hook Form with Zod schema validation
  const form = useForm<z.infer<typeof resourceFormSchema>>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: initialValues,
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof resourceFormSchema>) => {
    try {
      let uploadedImageUrl = values.image;

      // Upload new image if files are provided
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) {
          throw new Error("Image upload failed. Please try again.");
        }

        uploadedImageUrl = uploadedImages[0].url;
      }

      // Create or update resource
      if (type === "Create" && userId) {
        await createResource({
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          file: values.file,
          price: values.price,
          isFree: values.isFree,
          category: values.category,
          author: userId,
        });

        form.reset();
        router.push(`/dashboard/resources`);
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

        form.reset();
        router.push(`/dashboard/resources`);
      }
    } catch (error) {
      console.error("Resource operation failed:", error);
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

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Title" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="textarea rounded-2xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stack Field */}
        <FormField
          control={form.control}
          name="stack"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Stack (e.g., React, Node.js)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="w-full">
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

        {/* URL Field */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="URL (e.g., https://example.com)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FILE Field */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Resource Link (e.g., https://...)"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PRICE Field */}
        <div className="flex items-center gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price (e.g., $10)"
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
            name="isFree"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <label
                      htmlFor="isFree"
                      className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Free Ticket
                    </label>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id="isFree"
                      className="mr-2 h-5 w-5 border-2 border-primary-500"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            ? "Add Resource"
            : "Update Resource"}
        </Button>
      </form>
    </Form>
  );
};

export default ResourceForm;
