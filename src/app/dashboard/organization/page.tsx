import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getAllOrganizations } from "@/services/db/organization/organization-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { CreateOrganizationDialog } from "./_components/create-organization-dialog";
import { OrganizationSearch } from "./_components/organization-search";
import { OrganizationTable } from "./_components/organization-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function OrganizationPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");
  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const organizations = await getAllOrganizations(session.user.id, searchTerm);

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
          <div className="flex flex-col gap-1">
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
    </>
  );
}
