import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAllInvitations } from "@/services/db/invitation/invitation-cached-service";
import { SiteHeaderWithBreadcrumb } from "../_components/header/site-header-with-breadcrumb";
import { InviteSearch } from "./_components/invite-search";
import { InviteTable } from "./_components/invite-table";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function InvitesPage(props: {
  searchParams: SearchParams;
}) {
  await connection();
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) return redirect("/sign-in");

  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const invites = await getAllInvitations(
    undefined,
    session.user.id,
    undefined,
    searchTerm,
    100,
  );

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard", href: "" },
          { label: "Convites", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
          <p className="text-muted-foreground">
            Gerencie os convites enviados para as organizações.
          </p>
        </div>

        <InviteSearch />
        <InviteTable invites={invites} />
      </div>
    </>
  );
}
