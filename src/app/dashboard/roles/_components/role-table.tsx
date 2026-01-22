import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MemberRole } from "@/services/db/schema";

interface RoleTableProps {
  roles: MemberRole[];
}

export function RoleTable({ roles }: RoleTableProps) {
  const getRoleBadge = (role: string) => {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case "admin":
      case "owner":
        return <Badge variant="default">{role}</Badge>;
      case "manager":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            {role}
          </Badge>
        );
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
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-mono text-muted-foreground">
                  {role.id}
                </TableCell>
                <TableCell>{getRoleBadge(role.role)}</TableCell>
                <TableCell className="font-medium">{role.name}</TableCell>
              </TableRow>
            ))}
            {roles.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhuma função encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-muted-foreground">
                  ID: {role.id}
                </p>
                {getRoleBadge(role.role)}
              </div>

              <div>
                <p className="font-medium">{role.name}</p>
              </div>
            </div>
          </div>
        ))}
        {roles.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Nenhuma função encontrada.
          </div>
        )}
      </div>
    </>
  );
}
