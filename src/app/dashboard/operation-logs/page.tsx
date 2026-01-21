import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAllOperationLogs } from "@/services/db/log/log-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { OperationLogSearch } from "./_components/operation-log-search";
import { OperationLogTable } from "./_components/operation-log-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function OperationLogsPage(props: {
  searchParams: SearchParams;
}) {
  await connection();
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/auth/login");

  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const logs = await getAllOperationLogs(undefined, undefined, searchTerm, 100);

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Logs de Operação", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Logs de Operação
          </h1>
          <p className="text-muted-foreground">
            Visualize o histórico de operações realizadas no sistema.
          </p>
        </div>

        <OperationLogSearch />
        <OperationLogTable logs={logs} />
      </div>
    </>
  );
}
