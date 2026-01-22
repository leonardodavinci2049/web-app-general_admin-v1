import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TblApp } from "@/services/db/schema";

interface PlatformTableProps {
  platforms: TblApp[];
}

export function PlatformTable({ platforms }: PlatformTableProps) {
  return (
    <>
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platforms.map((platform) => (
              <TableRow key={platform.id}>
                <TableCell className="font-mono text-muted-foreground">
                  {platform.id}
                </TableCell>
                <TableCell className="font-medium">
                  <Badge variant="outline">{platform.name || "-"}</Badge>
                </TableCell>
                <TableCell>{platform.description || "-"}</TableCell>
              </TableRow>
            ))}
            {platforms.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhuma plataforma encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-muted-foreground">
                  ID: {platform.id}
                </p>
                <Badge variant="outline">{platform.name || "-"}</Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {platform.description || "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
        {platforms.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Nenhuma plataforma encontrada.
          </div>
        )}
      </div>
    </>
  );
}
