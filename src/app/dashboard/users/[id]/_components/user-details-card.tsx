"use client";

import {
  CalendarIcon,
  Check,
  Fingerprint,
  Mail,
  Pencil,
  Shield,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User as UserType } from "@/database/shared/auth/auth.types";
import {
  type UpdateUserFieldActionState,
  updateUserEmailAction,
  updateUserNameAction,
  updateUserRoleAction,
} from "../_actions/user-actions";

interface UserDetailsCardProps {
  user: UserType;
}

function DetailItem({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <div
        className={`font-semibold text-lg leading-tight truncate ${className}`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  icon: Icon,
  userId,
  fieldName,
  action,
  type = "text",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  userId: string;
  fieldName: string;
  action: (
    prev: UpdateUserFieldActionState,
    formData: FormData,
  ) => Promise<UpdateUserFieldActionState>;
  type?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    setCurrentValue(value);
    setIsEditing(false);
    setError(null);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action({ success: false, message: "" }, formData);
      if (result.success) {
        setIsEditing(false);
        setError(null);
      } else {
        setError(result.message);
      }
    });
  }

  if (!isEditing) {
    return (
      <TooltipProvider>
        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center group">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
            <Icon className="h-3.5 w-3.5" /> {label}
          </span>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-lg leading-tight truncate flex-1">
              {currentValue || "N/A"}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar {label.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-3 rounded-lg bg-muted/50 border border-primary/20 min-h-[80px]">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <form
        action={(formData) => {
          formData.set("userId", userId);
          handleSubmit(formData);
        }}
        className="flex items-center gap-2"
      >
        <input type="hidden" name="userId" value={userId} />
        <Input
          name={fieldName}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          type={type}
          className="h-8 text-sm flex-1"
          disabled={isPending}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCancel();
          }}
        />
        <div className="flex gap-1 shrink-0">
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
            disabled={isPending || currentValue === value}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function EditableRoleField({
  value,
  userId,
}: {
  value: string;
  userId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    setCurrentValue(value);
    setIsEditing(false);
    setError(null);
  }

  function handleRoleChange(newRole: string) {
    setCurrentValue(newRole);

    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("role", newRole);

    startTransition(async () => {
      const result = await updateUserRoleAction(
        { success: false, message: "" },
        formData,
      );
      if (result.success) {
        setIsEditing(false);
        setError(null);
      } else {
        setError(result.message);
      }
    });
  }

  if (!isEditing) {
    return (
      <TooltipProvider>
        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center group">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
            <Shield className="h-3.5 w-3.5" /> Função
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{currentValue}</Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar função</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-3 rounded-lg bg-muted/50 border border-primary/20 min-h-[80px]">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
        <Shield className="h-3.5 w-3.5" /> Função
      </span>
      <div className="flex items-center gap-2">
        <Select
          value={currentValue}
          onValueChange={handleRoleChange}
          disabled={isPending}
        >
          <SelectTrigger className="h-8 text-sm w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">user</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
          onClick={handleCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <CardTitle>Detalhes do Usuário</CardTitle>
            <CardDescription>
              Informações pessoais e de conta do usuário
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <EditableField
          label="Nome"
          value={user.name}
          icon={User}
          userId={user.id}
          fieldName="name"
          action={updateUserNameAction}
        />

        <EditableField
          label="Email"
          value={user.email}
          icon={Mail}
          userId={user.id}
          fieldName="email"
          action={updateUserEmailAction}
          type="email"
        />

        <EditableRoleField value={user.role || "user"} userId={user.id} />

        <DetailItem
          label="ID do Usuário"
          value={user.id}
          icon={Fingerprint}
          className="font-mono text-sm"
        />

        <DetailItem
          label="Criado em"
          value={
            user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"
          }
          icon={CalendarIcon}
        />
      </CardContent>
    </Card>
  );
}
