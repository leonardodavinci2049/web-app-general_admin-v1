"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteOrganizationAction } from "../../action/actions";

interface OrganizationDeletionProps {
  organizationId: string;
  organizationName: string;
}

export function OrganizationDeletion({
  organizationId,
  organizationName,
}: OrganizationDeletionProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteOrganizationAction(organizationId);

        if (result.success) {
          toast.success("Organização excluída com sucesso");
          setIsDialogOpen(false);
          router.push("/dashboard/organization");
          router.refresh();
        } else {
          toast.error(result.message || "Erro ao excluir organização");
        }
      } catch (_error) {
        toast.error("Ocorreu um erro ao excluir a organização");
      }
    });
  }

  return (
    <Card className="border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Excluir Organização</CardTitle>
        <CardDescription>
          Exclua permanentemente esta organização e todos os dados associados.
          Esta ação não pode ser desfeita.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Ao excluir a organização <strong>{organizationName}</strong>,
              todos os membros, configurações e dados associados serão removidos
              permanentemente.
            </AlertDescription>
          </Alert>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full md:w-fit">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Organização Permanentemente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir a organização{" "}
                  <strong>{organizationName}</strong>? Esta ação não pode ser
                  desfeita e todos os dados serão perdidos.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
