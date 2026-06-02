import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationDeletion } from "../organization-deletion";
import {
  OrganizationImagesSection,
  OrganizationImagesSectionSkeleton,
} from "../organization-images-section";
import {
  OrganizationNotMembersSection,
  OrganizationNotMembersSectionSkeleton,
} from "../organization-not-members-section";
import {
  OrganizationSettingsSection,
  OrganizationSettingsSectionSkeleton,
} from "../organization-settings-section";
import { TabsMembersSection } from "./tabs-members-section";

type TabMainSectionProps = {
  organizationId: string;
  organizationName: string;
};

export function TabsMainSection({
  organizationId,
  organizationName,
}: TabMainSectionProps) {
  return (
    <Tabs defaultValue="membros" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto md:h-9">
        <TabsTrigger value="membros">Membros</TabsTrigger>
        <TabsTrigger value="adicionar">Adicionar</TabsTrigger>
        <TabsTrigger value="imagens">Imagens</TabsTrigger>
        <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        <TabsTrigger value="excluir">Excluir</TabsTrigger>
      </TabsList>

      <TabsContent value="membros" className="space-y-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Membros</h2>
          <p className="text-muted-foreground">
            Gerenciar os membros desta organização.
          </p>
        </div>
        <TabsMembersSection organizationId={organizationId} />
      </TabsContent>

      <TabsContent value="adicionar" className="space-y-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Adicionar Membros
          </h2>
          <p className="text-muted-foreground">
            Adicione usuários como membros desta organização.
          </p>
        </div>
        <Suspense fallback={<OrganizationNotMembersSectionSkeleton />}>
          <OrganizationNotMembersSection organizationId={organizationId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="imagens" className="space-y-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Imagens</h2>
          <p className="text-muted-foreground">
            Gerenciar as imagens da organização.
          </p>
        </div>
        <Suspense fallback={<OrganizationImagesSectionSkeleton />}>
          <OrganizationImagesSection organizationId={organizationId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="configuracoes" className="space-y-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Ajustar as preferências e dados de configuração da organização.
          </p>
        </div>
        <Suspense fallback={<OrganizationSettingsSectionSkeleton />}>
          <OrganizationSettingsSection organizationId={organizationId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="excluir" className="pt-4">
        <OrganizationDeletion
          organizationId={organizationId}
          organizationName={organizationName}
        />
      </TabsContent>
    </Tabs>
  );
}
