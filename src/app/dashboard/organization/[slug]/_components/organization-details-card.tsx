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
import { updateOrganizationNameAction } from "../../action/actions";

interface OrganizationDetailsCardProps {
  organization: OrganizationDetail;
}

export function OrganizationDetailsCard({
  organization,
}: OrganizationDetailsCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(organization.name);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(organization.name);
  }, [organization.name]);

  const handleSaveName = async () => {
    if (!name || name.trim() === "") {
      toast.error("O nome da organização não pode ser vazio.");
      return;
    }

    if (name === organization.name) {
      setIsEditingName(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOrganizationNameAction(organization.id, name);
      if (result.success) {
        toast.success(result.message);
        setIsEditingName(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erro inesperado ao atualizar o nome da organização.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditingName(false);
    setName(organization.name);
  };

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
        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors relative group min-h-[80px] justify-center">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider mb-auto">
            <Building2 className="h-3.5 w-3.5" /> Nome
            {!isEditingName && (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-background rounded-md"
                aria-label="Editar nome"
              >
                <Pencil className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </span>
          {isEditingName ? (
            <div className="flex items-center gap-1 mt-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0 hover:bg-green-100/50 hover:text-green-600"
                onClick={handleSaveName}
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
              className="font-semibold text-lg leading-tight truncate focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded w-full text-left hover:bg-accent hover:text-accent-foreground transition-colors px-1 -ml-1"
              title={organization.name}
              onClick={() => setIsEditingName(true)}
            >
              {organization.name}
            </button>
          )}
        </div>

        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
            <HashIcon className="h-3.5 w-3.5" /> ID do Sistema
          </span>
          <span className="font-semibold text-lg">
            {organization.system_id || "N/A"}
          </span>
        </div>

        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
            <Fingerprint className="h-3.5 w-3.5" /> Slug
          </span>
          <span className="font-mono text-sm font-medium">
            {organization.slug}
          </span>
        </div>

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
