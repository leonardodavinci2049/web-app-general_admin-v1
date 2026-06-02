import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateOrganizationMemberUserDialog } from "../create-organization-member-user-dialog";
import {
  OrganizationMembersSection,
  OrganizationMembersSectionSkeleton,
} from "../organization-members-section";

type TabsMembersSectionProps = {
  organizationId: string;
};

export function TabsMembersSection({
  organizationId,
}: TabsMembersSectionProps) {
  return (
    <Tabs defaultValue="gestor" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-9">
        <TabsTrigger value="gestor">Gestor</TabsTrigger>
        <TabsTrigger value="pdv">PDV</TabsTrigger>
        <TabsTrigger value="expedicao">Expedição</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
      </TabsList>

      <TabsContent value="gestor" className="space-y-4 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CreateOrganizationMemberUserDialog organizationId={organizationId} />
        </div>
        <Suspense fallback={<OrganizationMembersSectionSkeleton />}>
          <OrganizationMembersSection organizationId={organizationId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="pdv" className="space-y-4 pt-4">
        <p className="text-muted-foreground text-sm">
          Funcionalidade em desenvolvimento.
        </p>
      </TabsContent>

      <TabsContent value="expedicao" className="space-y-4 pt-4">
        <p className="text-muted-foreground text-sm">
          Funcionalidade em desenvolvimento.
        </p>
      </TabsContent>

      <TabsContent value="financeiro" className="space-y-4 pt-4">
        <p className="text-muted-foreground text-sm">
          Funcionalidade em desenvolvimento.
        </p>
      </TabsContent>
    </Tabs>
  );
}
