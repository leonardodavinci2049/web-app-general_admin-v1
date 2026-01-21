import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Invitation } from "@/db/schema";

interface InviteTableProps {
  invites: Invitation[];
}

export function InviteTable({ invites }: InviteTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "accepted":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Aceito
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "expired":
        return <Badge variant="outline">Expirado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isExpired = (expiresAt: Date | string) => {
    return new Date(expiresAt) < new Date();
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge variant="default">{role}</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <>
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enviado por</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell className="font-medium">{invite.email}</TableCell>
                <TableCell>{getRoleBadge(invite.role)}</TableCell>
                <TableCell>
                  {isExpired(invite.expiresAt) && invite.status === "pending"
                    ? getStatusBadge("expired")
                    : getStatusBadge(invite.status)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {invite.inviterId}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(invite.expiresAt))}
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                  }).format(new Date(invite.createdAt))}
                </TableCell>
              </TableRow>
            ))}
            {invites.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum convite encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">{invite.email}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {getRoleBadge(invite.role)}
                {isExpired(invite.expiresAt) && invite.status === "pending"
                  ? getStatusBadge("expired")
                  : getStatusBadge(invite.status)}
              </div>

              <div className="space-y-2 pt-3 border-t text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Enviado por</span>
                  <span className="max-w-[150px] truncate">
                    {invite.inviterId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expira em</span>
                  <span>
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(invite.expiresAt))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Criado em</span>
                  <span>
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                    }).format(new Date(invite.createdAt))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {invites.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Nenhum convite encontrado.
          </div>
        )}
      </div>
    </>
  );
}
