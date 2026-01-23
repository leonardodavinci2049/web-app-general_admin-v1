"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { removeMember } from "@/server/members";
import type { Member } from "@/services/db/schema";

interface MembersActionsProps {
  member: Member;
}

export function MembersActions({ member }: MembersActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success, error } = await removeMember(member.id);
      if (success) {
        toast.success("Membro removido com sucesso");
        setShowDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(error || "Falha ao remover membro");
      }
    } catch (_error) {
      toast.error("Ocorreu um erro");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    toast.info("Funcionalidade de editar cargo em breve");
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 h-8"
        >
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-8"
        >
          Remover
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover{" "}
              <strong>{member.user?.name}</strong> da organização? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
