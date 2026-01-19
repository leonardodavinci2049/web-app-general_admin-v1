import { getUserId } from "@/lib/auth/get-user-id";
import { getAllOrganizations } from "@/services/db/organization/organization-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { CreateOrganizationDialog } from "../admin/_components/create-organization-dialog";
import { OrganizationTable } from "../admin/_components/organization-table";

export default async function OrganizationPage() {
  // Obter userId FORA do cache scope (usa headers())
  const userId = await getUserId();

  // Carregamento com cache - userId passado como argumento
  const organizations = await getAllOrganizations(userId);

  return (
    <>
      {/* Header fixo no topo */}
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Organizations", isActive: true },
        ]}
      />
      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
            <p className="text-muted-foreground">
              Gerencie suas Empresas Clientes.
            </p>
          </div>
          <CreateOrganizationDialog />
        </div>

        <OrganizationTable organizations={organizations} />
      </div>
    </>
  );
}
