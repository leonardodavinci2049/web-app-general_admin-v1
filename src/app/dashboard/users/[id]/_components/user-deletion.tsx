"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { LoadingSwap } from "@/components/auth/loading-swap";
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
import {
  type DeleteUserActionState,
  deleteUserAction,
} from "../_actions/user-actions";

interface UserDeletionProps {
  userId: string;
  userName: string;
}

export function UserDeletion({ userId, userName }: UserDeletionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [state, formAction] = useActionState<DeleteUserActionState, FormData>(
    deleteUserAction,
    { success: false, message: "" },
  );

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/users");
    }
  }, [state.success, router]);

  return (
    <Card className="border border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Excluir Usuário</CardTitle>
        <CardDescription>
          Exclua permanentemente este usuário e todos os dados associados. Esta
          ação não pode ser desfeita.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Ao excluir o usuário <strong>{userName}</strong>, todos os dados
              associados a ele serão removidos permanentemente do sistema.
            </AlertDescription>
          </Alert>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Usuário Permanentemente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o usuário{" "}
                  <strong>{userName}</strong>? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <form
                action={(formData) => {
                  formData.set("userId", userId);
                  startTransition(() => {
                    formAction(formData);
                  });
                }}
              >
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isPending}
                  >
                    <LoadingSwap isLoading={isPending}>
                      Confirmar Exclusão
                    </LoadingSwap>
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
