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
import { projectDefaultValues } from "@/constants";
import { IProject } from "@/lib/database/models/project.model";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "WebApps",
  "MobileApps",
  "Games",
];

export const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters."),
  stack: z.string().min(3, "Stack must be at least 3 characters."),
  image: z.string(),
  url: z.string().url("Must be a valid URL."),
  category: z.string().refine((val) => categories.includes(val), {
    message: "Invalid category selected.",
  }),
});

type ProjectFormProps = {
  userId: string;
  type: "Create" | "Update";
  project?: IProject;
  projectId?: string;
};

const ProjectForm = ({
  userId,
  type,
  project,
  projectId,
}: ProjectFormProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  // Determine initial form values
  const initialValues =
    project && type === "Update"
      ? {
          ...project,
        }
      : projectDefaultValues;

  const { startUpload } = useUploadThing("imageUploader");

  // Setup React Hook Form with Zod schema validation
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues,
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof projectFormSchema>) => {
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

      // Create or update project
      if (type === "Create" && userId) {
        await createProject({
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          category:values.category,
        });

        form.reset();
        router.push(`/dashboard/projects`);
      } else if (type === "Update" && userId && projectId) {
        await updateProject(projectId, {
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          category:values.category,
        });

        form.reset();
        router.push(`/dashboard/projects`);
      }
    } catch (error) {
      console.error("Project operation failed:", error);
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
            ? "Add Project"
            : "Update Project"}
        </Button>
      </form>
    </Form>
  );
};

export default ProjectForm;
