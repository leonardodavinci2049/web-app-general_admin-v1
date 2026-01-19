"use client";

import { Plus } from "lucide-react";
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
import { CreateOrganizationForm } from "../../organization/_forms/create-organization";

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Criar Organização</span>
          <span className="sm:hidden">Organização</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Organização</DialogTitle>
          <DialogDescription>
            Crie uma nova organização para começar.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
