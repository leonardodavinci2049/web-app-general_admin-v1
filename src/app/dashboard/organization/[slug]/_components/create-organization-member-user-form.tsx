"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  checkEmailExistsAction,
  createUserAndAddMemberAction,
} from "@/app/dashboard/organization/action/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CreateOrganizationMemberUserInput,
  createOrganizationMemberUserSchema,
} from "./create-organization-member-user-schema";
import { MEMBER_ROLE_LABELS, MEMBER_ROLES } from "./member-roles";

type EmailCheckStatus = "idle" | "checking" | "available" | "taken";

interface CreateOrganizationMemberUserFormProps {
  organizationId: string;
  appId: number;
  onSuccess?: () => void;
}

export function CreateOrganizationMemberUserForm({
  organizationId,
  appId,
  onSuccess,
}: CreateOrganizationMemberUserFormProps) {
  const [isPending, startTransition] = useTransition();
  const [emailCheckStatus, setEmailCheckStatus] =
    useState<EmailCheckStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<CreateOrganizationMemberUserInput>({
    resolver: zodResolver(
      createOrganizationMemberUserSchema,
    ) as Resolver<CreateOrganizationMemberUserInput>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      memberRole: "customer",
      personId: undefined,
    },
  });

  const checkEmailAvailability = useCallback(
    (email: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const trimmed = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmed || !emailRegex.test(trimmed)) {
        setEmailCheckStatus("idle");
        return;
      }

      setEmailCheckStatus("checking");

      debounceRef.current = setTimeout(() => {
        startTransition(async () => {
          const result = await checkEmailExistsAction(trimmed);
          if (result.exists) {
            setEmailCheckStatus("taken");
            form.setError("email", {
              message: "Já existe um usuário cadastrado com este e-mail.",
            });
          } else {
            setEmailCheckStatus("available");
            form.clearErrors("email");
          }
        });
      }, 500);
    },
    [form],
  );

  function onSubmit(data: CreateOrganizationMemberUserInput) {
    if (emailCheckStatus === "taken") {
      form.setError("email", {
        message: "Já existe um usuário cadastrado com este e-mail.",
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("memberRole", data.memberRole);
      formData.append("personId", String(data.personId));
      formData.append("organizationId", organizationId);
      formData.append("appId", String(appId));

      const result = await createUserAndAddMemberAction(
        { success: false, message: "" },
        formData,
      );

      if (result.success) {
        toast.success(result.message);
        setEmailCheckStatus("idle");
        form.reset();
        onSuccess?.();
      } else {
        if (result.errors) {
          if (result.errors.name) {
            form.setError("name", { message: result.errors.name[0] });
          }
          if (result.errors.email) {
            form.setError("email", { message: result.errors.email[0] });
          }
          if (result.errors.password) {
            form.setError("password", { message: result.errors.password[0] });
          }
          if (result.errors.memberRole) {
            form.setError("memberRole", {
              message: result.errors.memberRole[0],
            });
          }
          if (result.errors.personId) {
            form.setError("personId", { message: result.errors.personId[0] });
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
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: João Silva"
                  autoComplete="name"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Ex: joao@exemplo.com"
                    autoComplete="email"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      checkEmailAvailability(e.target.value);
                    }}
                    onBlur={() => {
                      if (field.value?.trim()) {
                        checkEmailAvailability(field.value);
                      }
                    }}
                  />
                  {emailCheckStatus === "checking" && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                  {emailCheckStatus === "available" && (
                    <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
                  )}
                  {emailCheckStatus === "taken" && (
                    <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                  )}
                </div>
              </FormControl>
              {emailCheckStatus === "available" &&
                !form.formState.errors.email && (
                  <p className="text-sm text-green-600">E-mail disponível</p>
                )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Mínimo 8 caracteres, 1 número e 1 especial"
                  autoComplete="new-password"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memberRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função no Organização</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MEMBER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {MEMBER_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PersonId</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Ex: 12345"
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? undefined : Number(val));
                  }}
                  value={field.value == null ? "" : String(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending || emailCheckStatus === "taken"}
            className="w-full sm:w-auto"
          >
            {isPending ? "Criando..." : "Criar Usuário e Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
