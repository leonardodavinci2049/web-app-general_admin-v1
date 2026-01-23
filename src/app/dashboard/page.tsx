import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/auth";
import { getAllOrganizations } from "@/services/db/organization/organization-cached-service";
import { SiteHeaderWithBreadcrumb } from "./_components/header/site-header-with-breadcrumb";
import { InvitationStatus } from "./_components/invitation-status";
import { CreateOrganizationDialog } from "./organization/_components/create-organization-dialog";
import { OrganizationSearch } from "./organization/_components/organization-search";
import { OrganizationTable } from "./organization/_components/organization-table";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");

  const organizations = await getAllOrganizations(session.user.id);
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header fixo no topo */}
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "#" },
          { label: "Analytics", isActive: true },
        ]}
      />

      {/* Conteúdo com scroll */}
      <div className="container mx-auto py-10 px-4 space-y-6">
        {/* Status do convite */}
        <Suspense fallback={null}>
          <InvitationStatus />
        </Suspense>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
            <p className="text-muted-foreground">
              Gerencie suas Empresas Clientes.
            </p>
          </div>
          <CreateOrganizationDialog />
        </div>
        <OrganizationSearch />
        <OrganizationTable organizations={organizations} />
      </div>
    </div>
  );
}
