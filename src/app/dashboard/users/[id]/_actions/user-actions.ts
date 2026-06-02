"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { UserAuthService } from "@/services/user/user.service";

export type DeleteUserActionState = {
  success: boolean;
  message: string;
  errors?: {
    userId?: string[];
  };
};

export type UpdateUserFieldActionState = {
  success: boolean;
  message: string;
  errors?: {
    field?: string[];
  };
};

export async function deleteUserAction(
  formData: FormData,
): Promise<DeleteUserActionState> {
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    return {
      success: false,
      message: "User ID is required",
      errors: { userId: ["User ID is required"] },
    };
  }

  try {
    const deletedUser = await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    });

    if (!deletedUser) {
      return {
        success: false,
        message: "Failed to delete user",
      };
    }

    revalidatePath("/dashboard/users");

    redirect("/dashboard/users");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to delete user",
    };
  }
}

export async function updateUserNameAction(
  _prev: UpdateUserFieldActionState,
  formData: FormData,
): Promise<UpdateUserFieldActionState> {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;

  if (!userId || !name) {
    return { success: false, message: "userId e name são obrigatórios" };
  }

  const result = await UserAuthService.updateUserName({ userId, name });

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Erro ao atualizar nome",
    };
  }

  revalidatePath(`/dashboard/users/${userId}`);
  return { success: true, message: "Nome atualizado com sucesso" };
}

export async function updateUserEmailAction(
  _prev: UpdateUserFieldActionState,
  formData: FormData,
): Promise<UpdateUserFieldActionState> {
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;

  if (!userId || !email) {
    return { success: false, message: "userId e email são obrigatórios" };
  }

  const result = await UserAuthService.updateUserEmail({ userId, email });

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Erro ao atualizar email",
    };
  }

  revalidatePath(`/dashboard/users/${userId}`);
  return { success: true, message: "Email atualizado com sucesso" };
}

export async function updateUserRoleAction(
  _prev: UpdateUserFieldActionState,
  formData: FormData,
): Promise<UpdateUserFieldActionState> {
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;

  if (!userId || !role) {
    return { success: false, message: "userId e role são obrigatórios" };
  }

  const result = await UserAuthService.updateUserRole({ userId, role });

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Erro ao atualizar função",
    };
  }

  revalidatePath(`/dashboard/users/${userId}`);
  return { success: true, message: "Função atualizada com sucesso" };
}
