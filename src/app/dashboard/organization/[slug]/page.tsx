import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeaderWithBreadcrumb } from "@/app/dashboard/_components/header/site-header-with-breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Organization } from "@/database/schema";
import { getOrganizationBySlug } from "@/server/organizations";
import { getCurrentUser } from "@/server/users";
import { OrganizationDeletion } from "./_components/organization-deletion";
import {
  OrganizationDetailsSection,
  OrganizationDetailsSectionSkeleton,
} from "./_components/organization-details-section";
import {
  OrganizationImagesSection,
  OrganizationImagesSectionSkeleton,
} from "./_components/organization-images-section";
import {
  OrganizationMembersSection,
  OrganizationMembersSectionSkeleton,
} from "./_components/organization-members-section";
import {
  OrganizationNotMembersSection,
  OrganizationNotMembersSectionSkeleton,
} from "./_components/organization-not-members-section";
import {
  OrganizationSettingsSection,
  OrganizationSettingsSectionSkeleton,
} from "./_components/organization-settings-section";

type Params = Promise<{ slug: string }>;

async function getOrganizationData(slug: string) {
  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    notFound();
  }

  return organization;
}

type PageHeaderProps = {
  organization: Organization;
};

function PageHeader({ organization }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
      <Link href="/dashboard/organization">
        <Button variant="outline">Voltar</Button>
      </Link>
    </div>
  );
}

export default async function OrganizationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { currentUser } = await getCurrentUser();
  const organization = await getOrganizationData(slug);

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title={organization.name}
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organizations", href: "/dashboard/organization" },
          { label: organization.name, isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-8">
        <PageHeader organization={organization} />

        <Suspense fallback={<OrganizationDetailsSectionSkeleton />}>
          <OrganizationDetailsSection
            userId={currentUser.id}
            organizationId={organization.id}
          />
        </Suspense>

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
            <Suspense fallback={<OrganizationMembersSectionSkeleton />}>
              <OrganizationMembersSection organizationId={organization.id} />
            </Suspense>
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
              <OrganizationNotMembersSection organizationId={organization.id} />
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
              <OrganizationImagesSection organizationId={organization.id} />
            </Suspense>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-4 pt-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Configurações
              </h2>
              <p className="text-muted-foreground">
                Ajustar as preferências e dados de configuração da organização.
              </p>
            </div>
            <Suspense fallback={<OrganizationSettingsSectionSkeleton />}>
              <OrganizationSettingsSection organizationId={organization.id} />
            </Suspense>
          </TabsContent>

          <TabsContent value="excluir" className="pt-4">
            <OrganizationDeletion
              organizationId={organization.id}
              organizationName={organization.name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
