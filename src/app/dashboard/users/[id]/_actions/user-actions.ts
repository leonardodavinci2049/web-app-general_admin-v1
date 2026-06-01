"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export type DeleteUserActionState = {
  success: boolean;
  message: string;
  errors?: {
    userId?: string[];
  };
};

export async function deleteUserAction(
  _prevState: DeleteUserActionState,
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

    return {
      success: true,
      message: "Usuário excluído com sucesso.",
    };
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
