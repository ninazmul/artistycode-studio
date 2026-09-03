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
import { projectDefaultValues } from "@/constants";
import { IProject } from "@/lib/database/models/project.model";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Loader2, FolderKanban, Type, AlignLeft, Layers, Link, ImageIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = ["WebApps", "MobileApps", "Games"];

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
  author: z.string(),
});

type ProjectFormProps = {
  userId: string;
  type: "Create" | "Update";
  project?: IProject;
  projectId?: string;
  onSuccess?: () => void;
  withDialog?: {
    buttonText?: string;
    title?: string;
    description?: string;
  };
};

const ProjectForm = ({
  userId,
  type,
  project,
  projectId,
  onSuccess,
  withDialog,
}: ProjectFormProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const initialValues =
    project && type === "Update"
      ? {
        ...project,
      }
      : projectDefaultValues;

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: z.infer<typeof projectFormSchema>) => {
    const loadingToast = toast.loading(
      type === "Create" ? "Creating project..." : "Updating project..."
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
        await createProject({
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          category: values.category,
          author: userId,
        });

        toast.dismiss(loadingToast);
        toast.success("Project created successfully!");
        form.reset();
        if (onSuccess) onSuccess();
        if (withDialog) setDialogOpen(false);
        router.push(`/dashboard/projects`);
        router.refresh();
      } else if (type === "Update" && userId && projectId) {
        await updateProject(projectId, {
          title: values.title,
          description: values.description,
          stack: values.stack,
          image: uploadedImageUrl,
          url: values.url,
          category: values.category,
          author: userId,
        });

        toast.dismiss(loadingToast);
        toast.success("Project updated successfully!");
        form.reset();
        if (onSuccess) onSuccess();
        if (withDialog) setDialogOpen(false);
        router.push(`/dashboard/projects`);
        router.refresh();
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Project operation failed. Please try again.");
      console.error("Project operation failed:", error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <FolderKanban className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Project Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5" />
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
                    Choose the type of project you&apos;re showcasing.
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
                    Project Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Premium Portfolio Platform"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    A clear, descriptive name for your project.
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
                    placeholder="Describe the project, its goals, key features, and challenges overcome..."
                    {...field}
                    className="min-h-[120px] bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20 resize-y"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Minimum 15 characters. Include context, technologies, and outcomes.
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
                    placeholder="e.g. Next.js, TypeScript, Tailwind CSS, MongoDB, Stripe"
                    {...field}
                    className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Comma-separated list of technologies, frameworks, and tools used.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Link className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Media & Links
            </h3>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Project Preview Image
                </FormLabel>
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Upload a high-quality screenshot or cover image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" />
                  Live URL / Demo
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                  />
                </FormControl>
                <FormDescription className="text-[11px] text-white/40">
                  Full URL to the live project, demo, or case study page.
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
            onClick={() => withDialog ? setDialogOpen(false) : router.back()}
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
                {type === "Create" ? "Add Project" : "Update Project"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (withDialog) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 h-10 text-sm font-medium transition-all shrink-0">
            <Plus className="w-4 h-4" />
            {withDialog.buttonText || "Add Project"}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0e0e0e] border border-white/10 rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              {withDialog.title || "Add New Project"}
            </DialogTitle>
            <p className="text-white/40 text-sm mt-1">
              {withDialog.description || "Fill out all project details to add it to the portfolio."}
            </p>
          </DialogHeader>
          <div className="mt-4">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
};

export default ProjectForm;
