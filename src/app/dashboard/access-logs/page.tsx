import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAllLoginLogs } from "@/services/db/log/log-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { AccessLogSearch } from "./_components/access-log-search";
import { AccessLogTable } from "./_components/access-log-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AccessLogsPage(props: {
  searchParams: SearchParams;
}) {
  await connection();
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");

  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const logs = await getAllLoginLogs(undefined, undefined, searchTerm, 100);

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Logs de Acesso", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Logs de Acesso</h1>
          <p className="text-muted-foreground">
            Visualize o histórico de acessos dos usuários ao sistema.
          </p>
        </div>

        <AccessLogSearch />
        <AccessLogTable logs={logs} />
      </div>
    </>
  );
}
