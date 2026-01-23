import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Member } from "@/services/db/schema";
import { MembersActions } from "./members-actions";

type MembersTableProps = {
  members: Member[];
};

export default function MembersTable({ members }: MembersTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Entrou em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={member.user?.image || ""}
                      alt={member.user?.name || ""}
                    />
                    <AvatarFallback>
                      {member.user?.name?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {member.user?.name}
                </TableCell>
                <TableCell>{member.user?.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{member.role}</Badge>
                </TableCell>
                <TableCell>
                  {member.createdAt
                    ? new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "medium",
                      }).format(new Date(member.createdAt))
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <MembersActions member={member} />
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage
                  src={member.user?.image || ""}
                  alt={member.user?.name || ""}
                />
                <AvatarFallback>
                  {member.user?.name?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{member.user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {member.user?.email}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-fit">
                    {member.role}
                  </Badge>
                </div>
                {member.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    Entrou em{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "medium",
                    }).format(new Date(member.createdAt))}
                  </span>
                )}
              </div>
              <MembersActions member={member} />
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Nenhum membro encontrado.
          </div>
        )}
      </div>
    </>
  );
}
