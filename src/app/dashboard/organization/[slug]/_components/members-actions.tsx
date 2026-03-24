"use client";

import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import type { Member } from "@/database/schema";
import { removeMember, updateMemberPersonId } from "@/server/members";

interface MembersActionsProps {
  member: Member;
}

export function MembersActions({ member }: MembersActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personIdInput, setPersonIdInput] = useState(
    member.personId != null ? String(member.personId) : "",
  );
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

  const personIdValue = Number(personIdInput);
  const isPersonIdValid =
    personIdInput.trim() !== "" &&
    Number.isInteger(personIdValue) &&
    personIdValue > 0;

  const handleSavePersonId = async () => {
    if (!isPersonIdValid) return;

    setIsSaving(true);
    try {
      const { success, error } = await updateMemberPersonId(
        member.id,
        personIdValue,
      );
      if (success) {
        toast.success("Person ID atualizado com sucesso");
        setShowEditDialog(false);
        router.refresh();
      } else {
        toast.error(error || "Falha ao atualizar Person ID");
      }
    } catch (_error) {
      toast.error("Ocorreu um erro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEditDialog = () => {
    setPersonIdInput(member.personId != null ? String(member.personId) : "");
    setShowEditDialog(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenEditDialog}
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>
              Alterar Person ID de <strong>{member.user?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <label htmlFor="edit-person-id" className="text-sm font-medium">
              Person ID <span className="text-destructive">*</span>
            </label>
            <Input
              id="edit-person-id"
              type="number"
              min={1}
              step={1}
              required
              placeholder="Ex: 12345"
              value={personIdInput}
              onChange={(e) => setPersonIdInput(e.target.value)}
            />
            {personIdInput !== "" && !isPersonIdValid && (
              <p className="text-sm text-destructive">
                Person ID deve ser um inteiro positivo.
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleSavePersonId}
              disabled={isSaving || !isPersonIdValid}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
