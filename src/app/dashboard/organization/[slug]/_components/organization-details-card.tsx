"use client";

import { Building2, CalendarIcon, Fingerprint, HashIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationDetail } from "@/services/db/organization/organization-cached-service";

interface OrganizationDetailsCardProps {
  organization: OrganizationDetail;
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
        <div className="flex flex-col space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" /> Nome
          </span>
          <span className="font-semibold text-lg">{organization.name}</span>
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
