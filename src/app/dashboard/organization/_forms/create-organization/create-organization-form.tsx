"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { createOrganizationAction } from "./actions";
import {
  type CreateOrganizationInput,
  createOrganizationSchema,
} from "./schema";

interface CreateOrganizationFormProps {
  onSuccess?: () => void;
}

export function CreateOrganizationForm({
  onSuccess,
}: CreateOrganizationFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(
      createOrganizationSchema,
    ) as Resolver<CreateOrganizationInput>,
    defaultValues: {
      name: "",
      slug: "",
      system_id: undefined,
    },
  });

  function onSubmit(data: CreateOrganizationInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("system_id", String(data.system_id));

      const result = await createOrganizationAction(
        { success: false, message: "" },
        formData,
      );

      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess?.();
      } else {
        if (result.errors) {
          // Map server-side errors to form fields
          if (result.errors.name) {
            form.setError("name", { message: result.errors.name[0] });
          }
          if (result.errors.slug) {
            form.setError("slug", { message: result.errors.slug[0] });
          }
          if (result.errors.system_id) {
            form.setError("system_id", { message: result.errors.system_id[0] });
          }
        }
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Organização</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Acme Corp"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>O nome público da organização.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="system_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do Sistema</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex: 1001"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Identificador numérico único do sistema legado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: acme-corp"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Identificador único para URLs (apenas letras minúsculas, números
                e hifens).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando..." : "Criar Organização"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
