import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/db/auth/auth.service";
import { SiteHeaderWithBreadcrumb } from "../../_components/header/site-header-with-breadcrumb";
import { UserAccountsCard } from "./_components/security/user-accounts-card";
import { UserPasswordCard } from "./_components/security/user-password-card";
import { UserSessionsCard } from "./_components/security/user-sessions-card";
import { UserTwoFactorCard } from "./_components/security/user-two-factor-card";
import { UserDeletion } from "./_components/user-deletion";
import { UserDetailsCard } from "./_components/user-details-card";

type Params = Promise<{ id: string }>;

export default async function UserPage({ params }: { params: Params }) {
  await connection();
  const { id } = await params;

  const userResponse = await AuthService.findUserById({ userId: id });
  const user = userResponse.data;

  const sessionsResponse = await AuthService.findSessionsByUserId({
    userId: id,
  });
  const sessions = sessionsResponse.data || [];

  const accountsResponse = await AuthService.findAccountsByUserId({
    userId: id,
  });
  const accounts = accountsResponse.data || [];

  if (!user) {
    return notFound();
  }

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title={user.name || "Usuário"}
        breadcrumbItems={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Usuários", href: "/dashboard/users" },
          { label: user.name || "Detalhes", isActive: true },
        ]}
      />

      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">
              Gerencie as informações deste usuário.
            </p>
          </div>
          <Link href="/dashboard/users">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <UserDetailsCard user={user} />

          <div className="grid gap-6 md:grid-cols-2">
            <UserPasswordCard email={user.email} />
            <UserTwoFactorCard isEnabled={user.twoFactorEnabled ?? false} />
          </div>

          <UserSessionsCard sessions={sessions} />
          <UserAccountsCard accounts={accounts} />

          <UserDeletion userId={user.id} userName={user.name || "Usuário"} />
        </div>
      </div>
    </>
  );
}
