"use client";

import {
  Building2,
  CalendarIcon,
  Check,
  Fingerprint,
  HashIcon,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { OrganizationDetail } from "@/services/db/organization/organization-cached-service";
import {
  updateOrganizationNameAction,
  updateOrganizationSlugAction,
  updateOrganizationSystemIdAction,
} from "../../action/actions";

interface OrganizationDetailsCardProps {
  organization: OrganizationDetail;
}

interface EditableFieldProps {
  label: React.ReactNode;
  value: string | number | null | undefined;
  onSave: (value: string) => Promise<{ success: boolean; message: string }>;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function EditableField({
  label,
  value,
  onSave,
  icon: Icon,
  className,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    value === null || value === undefined ? "" : String(value),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentValue(value === null || value === undefined ? "" : String(value));
  }, [value]);

  const handleSave = async () => {
    if (!currentValue || currentValue.trim() === "") {
      toast.error("O campo não pode ser vazio.");
      return;
    }

    if (currentValue === String(value)) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSave(currentValue);
      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro inesperado ao atualizar o campo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentValue(value === null || value === undefined ? "" : String(value));
  };

  return (
    <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors relative group min-h-[80px] justify-center">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
        <Icon className="h-3.5 w-3.5" /> {label}
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-background rounded-md"
            aria-label={`Editar ${label}`}
          >
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </span>
      {isEditing ? (
        <div className="flex items-center gap-1 mt-1">
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            disabled={isLoading}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 hover:bg-green-100/50 hover:text-green-600"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 hover:bg-red-100/50 hover:text-red-600"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className={`font-semibold text-lg leading-tight truncate focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded w-full text-left hover:bg-accent hover:text-accent-foreground transition-colors px-1 -ml-1 ${className}`}
          title={String(value || "")}
          onClick={() => setIsEditing(true)}
        >
          {value || "N/A"}
        </button>
      )}
    </div>
  );
}

export function OrganizationDetailsCard({
  organization,
}: OrganizationDetailsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Detalhes da Organização</CardTitle>
        </div>
        <CardDescription>
          Informações principais e metadados da organização
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <EditableField
          label="Nome"
          value={organization.name}
          icon={Building2}
          onSave={async (val) =>
            await updateOrganizationNameAction(organization.id, val)
          }
        />

        <EditableField
          label="ID do Sistema"
          value={organization.system_id}
          icon={HashIcon}
          onSave={async (val) => {
            const num = Number(val);
            if (Number.isNaN(num)) {
              return {
                success: false,
                message: "ID deve ser um número válido",
              };
            }
            return await updateOrganizationSystemIdAction(organization.id, num);
          }}
        />

        <EditableField
          label="Slug"
          value={organization.slug}
          icon={Fingerprint}
          className="font-mono text-sm font-medium"
          onSave={async (val) =>
            await updateOrganizationSlugAction(organization.id, val)
          }
        />

        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
            <CalendarIcon className="h-3.5 w-3.5" /> Criado em
          </span>
          <span className="font-medium">
            {organization.createdAt
              ? new Date(organization.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
