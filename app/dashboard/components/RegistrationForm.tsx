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
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { FileUploader } from "@/components/shared/FileUploader";
import {
  createRegistration,
  updateRegistration,
} from "@/lib/actions/registration.actions";
import { IRegistration } from "@/lib/database/models/registration.model";
import { registrationDefaultValues } from "@/constants";
import { useRouter } from "next/navigation";

export const registrationFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  number: z.string().min(10, "Phone number must be valid."),
  email: z.string().email("Invalid email address."),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters."),
  emergencyContactNumber: z.string().min(10, "Phone number must be valid."),
  emergencyContactRelation: z
    .string()
    .min(2, "Relation must be at least 2 characters."),
  signature: z.string(),
  date: z.date(),
  status: z.string().min(3, "Status must be valid."),
  userId: z.string(),
});

type RegistrationFormProps = {
  userId: string;
  type: "Create" | "Update";
  registration?: IRegistration;
  registrationId?: string;
};
const RegistrationFrom = ({
  userId,
  type,
  registration,
  registrationId,
}: RegistrationFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const initialValues =
    registration && type === "Update"
      ? {
          ...registration,
          date: new Date(registration.date),
          userId: userId,
        }
      : registrationDefaultValues;

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof registrationFormSchema>) {
    let uploadedImageUrl = values.signature;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    try {
      if (type === "Create" && userId) {
        const newRegistration = await createRegistration({
          ...values,
          signature: uploadedImageUrl,
          userId,
        });

        if (newRegistration) {
          form.reset();
          router.push(`/profile`);
        }
      } else if (type === "Update" && userId && registrationId) {
        const updatedRegistration = await updateRegistration(registrationId, {
          ...values,
          signature: uploadedImageUrl,
          userId,
        });

        if (updatedRegistration) {
          form.reset();
        }
      }
    } catch (error) {
      console.error("Volunteer Registration failed", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* First Name Field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="First Name"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name Field */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Last Name"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Address"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number Field */}
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Phone Number"
                  {...field}
                  className="input-field"
                />
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

        {/* Emergency Contact Name Field */}
        <FormField
          control={form.control}
          name="emergencyContactName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Emergency Contact Name"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emergency Contact Number Field */}
        <FormField
          control={form.control}
          name="emergencyContactNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Emergency Contact Number"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emergency Contact Relation Field */}
        <FormField
          control={form.control}
          name="emergencyContactRelation"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Relation to Emergency Contact"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Signature Field */}
        <FormField
          control={form.control}
          name="signature"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor={field.name}>Upload your Signature</FormLabel>
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

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Uploading..." : "Submit Form"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationFrom;
