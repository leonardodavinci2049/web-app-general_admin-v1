import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAllMemberRoles } from "@/services/db/member/member-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { RoleTable } from "./_components/role-table";

export default async function RolesPage() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/auth/login");

  const roles = await getAllMemberRoles(undefined, undefined, 100);

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Funções", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
          <p className="text-muted-foreground">
            Gerencie as funções e permissões dos usuários.
          </p>
        </div>

        <RoleTable roles={roles} />
      </div>
    </>
  );
}
