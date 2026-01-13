import { getOrganizations } from "@/server/organizations";
import { SiteHeaderWithBreadcrumb } from "./_components/header/site-header-with-breadcrumb";
import { CreateOrganizationDialog } from "./admin/_components/create-organization-dialog";
import { OrganizationTable } from "./admin/_components/organization-table";


export default async function DashboardPage() {
    const organizations = await getOrganizations();
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
            <p className="text-muted-foreground">Gerencie suas Empresas Clientes.</p>
          </div>
          <CreateOrganizationDialog />
        </div>

        <OrganizationTable organizations={organizations} />
      </div>
    </div>
  );
}
