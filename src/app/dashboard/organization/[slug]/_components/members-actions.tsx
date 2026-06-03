"use client";

import { Check, ChevronsUpDown, Copy, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Member } from "@/database/schema";
import { cn } from "@/lib/utils";
import {
  generateUserPassword,
  removeMember,
  updateMemberPersonId,
  updateMemberRole,
  updateUserAppId,
  updateUserName,
} from "@/server/members";
import { MEMBER_ROLE_LABELS, MEMBER_ROLES } from "./member-roles";

const APP_OPTIONS = [
  { value: 2, label: "Gestor" },
  { value: 3, label: "PDV" },
  { value: 6, label: "Expedição" },
  { value: 7, label: "Financeiro" },
] as const;

interface MembersActionsProps {
  member: Member;
}

export function MembersActions({ member }: MembersActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [_generatedPassword, setGeneratedPassword] = useState("");
  const [passwordTextareaContent, setPasswordTextareaContent] = useState("");
  const [nameInput, setNameInput] = useState(member.user?.name ?? "");
  const [personIdInput, setPersonIdInput] = useState(
    member.personId != null ? String(member.personId) : "",
  );
  const [roleInput, setRoleInput] = useState(member.role);
  const [appIdInput, setAppIdInput] = useState<number | null>(
    member.user?.appId ?? null,
  );
  const [openCombobox, setOpenCombobox] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success, error } = await removeMember(member.id);
      if (success) {
        toast.success("Membro removido da organização com sucesso");
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
    roleInput !== member.role ||
    appIdInput !== (member.user?.appId ?? null);

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

      if (appIdInput !== (member.user?.appId ?? null)) {
        if (appIdInput !== null) {
          const appIdResult = await updateUserAppId(member.userId, appIdInput);
          if (!appIdResult.success) {
            toast.error(appIdResult.error || "Falha ao atualizar App ID");
            return;
          }
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
    setAppIdInput(member.user?.appId ?? null);
    setShowEditDialog(true);
  };

  const handleGeneratePassword = async () => {
    setIsGeneratingPassword(true);
    try {
      const result = await generateUserPassword(member.userId);
      if (result.success && result.password) {
        setGeneratedPassword(result.password);
        const content = [
          "Segue os dados de acesso ao sistema",
          `Email: ${member.user?.email}`,
          `Senha: ${result.password}`,
        ].join("\n");
        setPasswordTextareaContent(content);
        toast.success("Senha gerada com sucesso");
      } else {
        toast.error(result.error || "Falha ao gerar senha");
      }
    } catch (_error) {
      toast.error("Ocorreu um erro ao gerar a senha");
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  const handleCopyPasswordContent = async () => {
    try {
      await navigator.clipboard.writeText(passwordTextareaContent);
      toast.success("Conteúdo copiado para a área de transferência");
    } catch (_error) {
      toast.error("Falha ao copiar conteúdo");
    }
  };

  const handleOpenPasswordDialog = () => {
    setGeneratedPassword("");
    setPasswordTextareaContent("");
    setShowPasswordDialog(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-end flex-wrap">
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
          onClick={handleOpenPasswordDialog}
          className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8"
        >
          <KeyRound className="size-4 mr-1" />
          Senha
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

            <div className="space-y-2 flex flex-col">
              <label htmlFor="edit-appid" className="text-sm font-medium">
                App ID
              </label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-appid"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between font-normal text-left"
                  >
                    {appIdInput !== null
                      ? APP_OPTIONS.find(
                          (option) => option.value === appIdInput,
                        )?.label
                      : "Selecione um App"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Buscar app..." />
                    <CommandList>
                      <CommandEmpty>Nenhum app encontrado.</CommandEmpty>
                      <CommandGroup>
                        {APP_OPTIONS.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              setAppIdInput(option.value);
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                appIdInput === option.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <strong>{member.user?.name}</strong> da organização? O cadastro do
              usuário será mantido. Esta ação não pode ser desfeita.
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

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Senha</DialogTitle>
            <DialogDescription>
              Gere uma nova senha para <strong>{member.user?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              readOnly
              rows={3}
              value={passwordTextareaContent}
              placeholder="Clique em 'Gerar Senha' para criar uma nova senha"
              className="resize-none"
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleCopyPasswordContent}
                disabled={!passwordTextareaContent}
              >
                <Copy className="size-4 mr-1" />
                Copiar
              </Button>
              <Button
                onClick={handleGeneratePassword}
                disabled={isGeneratingPassword}
              >
                {isGeneratingPassword ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar Senha"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
