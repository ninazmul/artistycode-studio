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
import { createModerator } from "@/lib/actions/moderator.actions";
import toast from "react-hot-toast";
import { Loader2, User, Mail, UserCog, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const moderatorFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
});

type ModeratorFormProps = {
  userId: string;
  type: "Create";
  onSuccess?: () => void;
  withDialog?: {
    buttonText?: string;
    title?: string;
    description?: string;
  };
};

const ModeratorForm = ({ userId, type, onSuccess, withDialog }: ModeratorFormProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof moderatorFormSchema>>({
    resolver: zodResolver(moderatorFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof moderatorFormSchema>) {
    const loadingToast = toast.loading("Creating moderator...");
    try {
      if (type === "Create" && userId) {
        const newModerator = await createModerator({
          Name: values.name,
          Email: values.email,
        });

        if (newModerator) {
          toast.dismiss(loadingToast);
          toast.success("Moderator created successfully!");
          form.reset();
          if (onSuccess) onSuccess();
          if (withDialog) setDialogOpen(false);
          router.push(`/dashboard/moderators`);
          router.refresh();
        } else {
          throw new Error("Failed to create moderator.");
        }
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Moderator creation failed. Please try again.");
      console.error("Moderator creation failed", error);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <UserCog className="w-5 h-5 text-white/60" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Moderator Information
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
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Alex Morgan"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Display name of the moderator.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white/60 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="moderator@company.com"
                      {...field}
                      className="h-11 bg-white/[0.03] border-white/10 text-white rounded-xl placeholder:text-white/30 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormDescription className="text-[11px] text-white/40">
                    Used for sign-in and moderation updates.
                  </FormDescription>
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
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                Create Moderator
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (withDialog) {
    const {
      buttonText = "Add Moderator",
      title = "Add Moderator",
      description = "Grant moderation access to a trusted user.",
    } = withDialog;

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-5 h-10 text-sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0e0e0e] border-white/10 rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <p className="text-sm text-white/60">{description}</p>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
};

export default ModeratorForm;
