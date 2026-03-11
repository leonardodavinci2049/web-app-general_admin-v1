"use client";

import {
  CalendarIcon,
  Check,
  Fingerprint,
  Hash,
  Mail,
  Pencil,
  Shield,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import type { User as UserType } from "@/services/db/auth/types/auth.types";
import { updatePersonIdAction } from "./update-person-id-action";

interface UserDetailsCardProps {
  user: UserType;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function DetailItem({ label, value, icon: Icon, className }: DetailItemProps) {
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

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const router = useRouter();
  const [isEditingPersonId, setIsEditingPersonId] = useState(false);
  const [personIdValue, setPersonIdValue] = useState(
    user.personId?.toString() ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  async function handleSavePersonId() {
    setIsSaving(true);
    try {
      const result = await updatePersonIdAction(
        user.id,
        personIdValue.trim() === "" ? null : Number(personIdValue),
      );
      if (result.success) {
        toast.success(result.message);
        setIsEditingPersonId(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelPersonId() {
    setPersonIdValue(user.personId?.toString() ?? "");
    setIsEditingPersonId(false);
  }

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
        <DetailItem label="Nome" value={user.name} icon={User} />

        <DetailItem label="Email" value={user.email} icon={Mail} />

        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
            <Shield className="h-3.5 w-3.5" /> Função
          </span>
          <div>
            <Badge variant="outline">{user.role}</Badge>
          </div>
        </div>

        <DetailItem
          label="ID do Usuário"
          value={user.id}
          icon={Fingerprint}
          className="font-mono text-sm"
        />

        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-h-[80px] justify-center">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
            <Hash className="h-3.5 w-3.5" /> Person ID
          </span>
          {isEditingPersonId ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={personIdValue}
                onChange={(e) => setPersonIdValue(e.target.value)}
                className="h-8 text-sm"
                placeholder="Ex: 12345"
                disabled={isSaving}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={handleSavePersonId}
                disabled={isSaving}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={handleCancelPersonId}
                disabled={isSaving}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg leading-tight truncate font-mono">
                {user.personId ?? "N/A"}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 shrink-0"
                onClick={() => setIsEditingPersonId(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>

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
