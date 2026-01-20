import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/db/auth/auth.service";
import { SiteHeaderWithBreadcrumb } from "../../_components/header/site-header-with-breadcrumb";
import { UserDetailsCard } from "./_components/user-details-card";

type Params = Promise<{ id: string }>;

export default async function UserPage({ params }: { params: Params }) {
  await connection();
  const { id } = await params;

  const userResponse = await AuthService.findUserById({ userId: id });
  const user = userResponse.data;

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

        <div className="space-y-4">
          <UserDetailsCard user={user} />
        </div>
      </div>
    </>
  );
}
