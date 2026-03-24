import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LogLoginListItem } from "@/services/log/log-cached-service";

interface AccessLogTableProps {
  logs: LogLoginListItem[];
}

export function AccessLogTable({ logs }: AccessLogTableProps) {
  return (
    <>
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead>ID</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organização</TableHead>
              <TableHead>Log</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.log_id}>
                <TableCell className="font-mono text-muted-foreground">
                  {log.log_id}
                </TableCell>
                <TableCell className="font-medium">
                  {log.user_name || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.user_email || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.organization_name || "-"}
                </TableCell>
                <TableCell>{log.log || "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {log.note || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.createdAt &&
                    new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(log.createdAt))}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum log de acesso encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {logs.map((log) => (
          <div
            key={log.log_id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-mono text-muted-foreground">
                    ID: {log.log_id}
                  </p>
                  <p className="font-medium">{log.user_name || "-"}</p>
                  <p className="text-xs text-muted-foreground">{log.user_email || "-"}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    Organização
                  </span>
                  <span>{log.organization_name || "-"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Log</span>
                  <p className="line-clamp-2" title={log.log || ""}>
                    {log.log || "-"}
                  </p>
                </div>
                {log.note && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">Nota</span>
                    <span className="text-muted-foreground">{log.note}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>Data</span>
                <span>
                  {log.createdAt &&
                    new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(log.createdAt))}
                </span>
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Nenhum log de acesso encontrado.
          </div>
        )}
      </div>
    </>
  );
}
