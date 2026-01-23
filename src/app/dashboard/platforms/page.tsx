import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAllPlatformApps } from "@/services/db/platform/platform-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { PlatformTable } from "./_components/platform-table";

export default async function PlatformsPage() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");

  const platforms = await getAllPlatformApps(
    undefined,
    undefined,
    undefined,
    100,
  );

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Plataformas", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Plataformas</h1>
          <p className="text-muted-foreground">
            Gerencie as plataformas e aplicações do sistema.
          </p>
        </div>

        <PlatformTable platforms={platforms} />
      </div>
    </>
  );
}
