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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Member } from "@/database/schema";
import {
  removeMemberAndUser,
  updateMemberPersonId,
  updateMemberRole,
  updateUserName,
} from "@/server/members";
import { MEMBER_ROLE_LABELS, MEMBER_ROLES } from "./member-roles";

interface MembersActionsProps {
  member: Member;
}

export function MembersActions({ member }: MembersActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nameInput, setNameInput] = useState(member.user?.name ?? "");
  const [personIdInput, setPersonIdInput] = useState(
    member.personId != null ? String(member.personId) : "",
  );
  const [roleInput, setRoleInput] = useState(member.role);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success, error } = await removeMemberAndUser(
        member.id,
        member.userId,
      );
      if (success) {
        toast.success(
          "Membro removido e cadastro do usuário excluído com sucesso",
        );
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
    personIdInput.trim() === "" ||
    (Number.isInteger(personIdValue) && personIdValue > 0);
  const isNameValid = nameInput.trim().length > 0;
  const isRoleValid = roleInput.trim().length > 0;
  const isFormValid = isNameValid && isPersonIdValid && isRoleValid;

  const hasChanges =
    nameInput.trim() !== (member.user?.name ?? "") ||
    personIdInput !==
      (member.personId != null ? String(member.personId) : "") ||
    roleInput !== member.role;

  const handleSave = async () => {
    if (!isFormValid || !hasChanges) return;

    setIsSaving(true);
    try {
      const trimmedName = nameInput.trim();
      if (trimmedName !== (member.user?.name ?? "")) {
        const nameResult = await updateUserName(member.userId, trimmedName);
        if (!nameResult.success) {
          toast.error(nameResult.error || "Falha ao atualizar nome");
          return;
        }
      }

      if (
        personIdInput.trim() !== "" &&
        personIdInput !==
          (member.personId != null ? String(member.personId) : "")
      ) {
        const personIdResult = await updateMemberPersonId(
          member.id,
          personIdValue,
        );
        if (!personIdResult.success) {
          toast.error(personIdResult.error || "Falha ao atualizar Person ID");
          return;
        }
      } else if (personIdInput.trim() === "" && member.personId != null) {
        const personIdResult = await updateMemberPersonId(member.id, 0);
        if (!personIdResult.success) {
          toast.error(personIdResult.error || "Falha ao atualizar Person ID");
          return;
        }
      }

      if (roleInput !== member.role) {
        const roleResult = await updateMemberRole(member.id, roleInput);
        if (!roleResult.success) {
          toast.error(roleResult.error || "Falha ao atualizar cargo");
          return;
        }
      }

      toast.success("Membro atualizado com sucesso");
      setShowEditDialog(false);
      router.refresh();
    } catch (_error) {
      toast.error("Ocorreu um erro ao salvar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEditDialog = () => {
    setNameInput(member.user?.name ?? "");
    setPersonIdInput(member.personId != null ? String(member.personId) : "");
    setRoleInput(member.role);
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>
              Edite os dados de <strong>{member.user?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Nome <span className="text-destructive">*</span>
              </label>
              <Input
                id="edit-name"
                type="text"
                required
                placeholder="Nome do usuário"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              {nameInput !== "" && !isNameValid && (
                <p className="text-sm text-destructive">Nome é obrigatório.</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-person-id" className="text-sm font-medium">
                Person ID
              </label>
              <Input
                id="edit-person-id"
                type="number"
                min={1}
                step={1}
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

            <div className="space-y-2">
              <label htmlFor="edit-role" className="text-sm font-medium">
                Cargo <span className="text-destructive">*</span>
              </label>
              <Select value={roleInput} onValueChange={setRoleInput}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {MEMBER_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={isSaving || !isFormValid || !hasChanges}
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
              <strong>{member.user?.name}</strong> da organização e excluir seu
              cadastro? Esta ação não pode ser desfeita.
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
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Removendo...
                </>
              ) : (
                "Remover"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
