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
import { FileUploader } from "@/components/shared/FileUploader";
import { addResource, updateResource } from "@/lib/actions/resource.actions";
import { IResource } from "@/lib/database/models/resource.model";
import { resourceDefaultValues } from "@/constants";

export const resourceFormSchema = z.object({
  heading: z.string().min(3, "Heading must be at least 3 characters."),
  image: z.string(),
  link: z.string().min(3, "Link must be at least 3 characters."),
  category: z.string().min(3, "Category must be at least 3 characters."),
});

type ResourceFormProps = {
  userId: string;
  type: "Create" | "Update";
  resource?: IResource | undefined;
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

  async function onSubmit(values: z.infer<typeof resourceFormSchema>) {
    let uploadedImageUrl = values.image;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    try {
      if (type === "Create" && userId) {
        const newResource = await addResource({
          Heading: values.heading,
          Link: values.link,
          Category: values.category,
          Image: uploadedImageUrl,
        });

        if (newResource) {
          form.reset();
          router.push(`/dashboard/resources`);
        }
      } else if (type === "Update" && userId && resourceId) {
        const updatedResource = await updateResource(resourceId, {
          ...values,
          Image: uploadedImageUrl,
        });

        if (updatedResource) {
          form.reset();
          router.push(`/dashboard/resources`);
        }
      }
    } catch (error) {
      console.error("Resource uploading failed", error);
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
          name="heading"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Heading"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Write Category"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resource Field */}
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

        {/* Link Field */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Link" {...field} className="input-field" />
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
          {form.formState.isSubmitting ? "Uploading..." : "Add Resource"}
        </Button>
      </form>
    </Form>
  );
};

export default ResourceForm;
