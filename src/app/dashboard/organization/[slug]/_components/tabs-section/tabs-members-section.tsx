import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateOrganizationMemberUserDialog } from "../create-organization-member-user-dialog";
import {
  OrganizationMembersSection,
  OrganizationMembersSectionSkeleton,
} from "../organization-members-section";

const TAB_CONFIG = [
  { value: "gestor", label: "Gestor", appId: 2 },
  { value: "pdv", label: "PDV", appId: 3 },
  { value: "expedicao", label: "Expedição", appId: 6 },
  { value: "financeiro", label: "Financeiro", appId: 7 },
] as const;

type TabsMembersSectionProps = {
  organizationId: string;
};

export function TabsMembersSection({
  organizationId,
}: TabsMembersSectionProps) {
  return (
    <Tabs defaultValue="gestor" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-9">
        {TAB_CONFIG.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_CONFIG.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="space-y-4 pt-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CreateOrganizationMemberUserDialog
              organizationId={organizationId}
              appId={tab.appId}
            />
          </div>
          <Suspense fallback={<OrganizationMembersSectionSkeleton />}>
            <OrganizationMembersSection
              organizationId={organizationId}
              appId={tab.appId}
            />
          </Suspense>
        </TabsContent>
      ))}
    </Tabs>
  );
}
