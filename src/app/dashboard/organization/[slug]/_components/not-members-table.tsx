"use client";

import { Check, ChevronsUpDown, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { addMemberAction } from "@/app/dashboard/organization/action/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrganizationMemberRole, User } from "@/database/schema";
import { cn } from "@/lib/utils";
import { updateUserAppId } from "@/server/members";
import { MEMBER_ROLES } from "./member-roles";

const APP_OPTIONS = [
  { value: 2, label: "Gestor" },
  { value: 3, label: "PDV" },
  { value: 6, label: "Expedição" },
  { value: 7, label: "Financeiro" },
] as const;

type NotMembersTableProps = {
  users: User[];
  organizationId: string;
};

export default function NotMembersTable({
  users,
  organizationId,
}: NotMembersTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] =
    useState<OrganizationMemberRole>("customer");
  const [personIdInput, setPersonIdInput] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleAddMember = async () => {
    if (!selectedUser) return;

    if (selectedAppId === null) {
      toast.error("Selecione um App ID");
      return;
    }

    try {
      setLoadingId(selectedUser.id);

      const personId = Number(personIdInput);

      if (!Number.isInteger(personId) || personId <= 0) {
        toast.error("Person ID must be a positive integer");
        return;
      }

      const result = await addMemberAction(
        selectedUser.id,
        selectedRole,
        organizationId,
        personId,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const appIdResult = await updateUserAppId(selectedUser.id, selectedAppId);
      if (!appIdResult.success) {
        toast.error(appIdResult.error || "Falha ao atualizar App ID");
        return;
      }

      toast.success("Member added to organization");
      setIsDialogOpen(false);
      setSelectedUser(null);
      setSelectedRole("customer");
      setPersonIdInput("");
      setSelectedAppId(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to add member to organization");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const openAddMemberDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    disabled={loadingId === user.id}
                    onClick={() => openAddMemberDialog(user)}
                    size="sm"
                    variant="outline"
                  >
                    {loadingId === user.id ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 size-4" />
                    )}
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found to add.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar>
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>
                    {user.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                disabled={loadingId === user.id}
                onClick={() => openAddMemberDialog(user)}
                size="sm"
                variant="outline"
              >
                {loadingId === user.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                <span className="sr-only">Add {user.name}</span>
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No users found to add.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Select a role to add {selectedUser?.name} to this organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="role-select" className="text-sm font-medium">
                Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as OrganizationMemberRole)
                }
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="person-id-input" className="text-sm font-medium">
                Person ID <span className="text-destructive">*</span>
              </label>
              <Input
                id="person-id-input"
                type="number"
                min={1}
                step={1}
                required
                placeholder="Ex: 12345"
                value={personIdInput}
                onChange={(e) => setPersonIdInput(e.target.value)}
              />
              {personIdInput !== "" &&
                (!Number.isInteger(Number(personIdInput)) ||
                  Number(personIdInput) <= 0) && (
                  <p className="text-sm text-destructive">
                    Person ID must be a positive integer.
                  </p>
                )}
            </div>
            <div className="space-y-2 flex flex-col">
              <label htmlFor="appid-select" className="text-sm font-medium">
                App ID <span className="text-destructive">*</span>
              </label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    id="appid-select"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between font-normal text-left"
                  >
                    {selectedAppId !== null
                      ? APP_OPTIONS.find(
                          (option) => option.value === selectedAppId,
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
                              setSelectedAppId(option.value);
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAppId === option.value
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
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedUser(null);
                setSelectedRole("customer");
                setPersonIdInput("");
                setSelectedAppId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={
                loadingId !== null ||
                personIdInput.trim() === "" ||
                !Number.isInteger(Number(personIdInput)) ||
                Number(personIdInput) <= 0 ||
                selectedAppId === null
              }
            >
              {loadingId ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
