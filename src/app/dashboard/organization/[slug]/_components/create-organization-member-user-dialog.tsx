"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrganizationMemberUserForm } from "./create-organization-member-user-form";

interface CreateOrganizationMemberUserDialogProps {
  organizationId: string;
}

export function CreateOrganizationMemberUserDialog({
  organizationId,
}: CreateOrganizationMemberUserDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Usuário e Adicionar à Organização</DialogTitle>
          <DialogDescription>
            Crie um novo usuário e adicione-o automaticamente como membro desta
            organização.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationMemberUserForm
          organizationId={organizationId}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
