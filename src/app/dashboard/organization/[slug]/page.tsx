import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeaderWithBreadcrumb } from "@/app/dashboard/_components/header/site-header-with-breadcrumb";
import { Button } from "@/components/ui/button";
import { getOrganizationBySlug } from "@/server/organizations";
import { getCurrentUser } from "@/server/users";
import type { Organization } from "@/services/db/schema";
import {
  OrganizationDetailsSection,
  OrganizationDetailsSectionSkeleton,
} from "./_components/organization-details-section";
import {
  OrganizationInviteSection,
  OrganizationInviteSectionSkeleton,
} from "./_components/organization-invite-section";
import {
  OrganizationMembersSection,
  OrganizationMembersSectionSkeleton,
} from "./_components/organization-members-section";

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

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Membros</h2>
            <p className="text-muted-foreground">
              Gerenciar os membros desta organização.
            </p>
          </div>
          <Suspense fallback={<OrganizationMembersSectionSkeleton />}>
            <OrganizationMembersSection organizationId={organization.id} />
          </Suspense>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Convide Usuários
            </h2>
            <p className="text-muted-foreground">
              Convide usuários para se juntarem a esta organização.
            </p>
          </div>
          <Suspense fallback={<OrganizationInviteSectionSkeleton />}>
            <OrganizationInviteSection organizationId={organization.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
