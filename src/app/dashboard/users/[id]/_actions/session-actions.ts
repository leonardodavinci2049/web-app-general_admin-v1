"use server";

import { revalidatePath } from "next/cache";
import { AuthService } from "@/services/db/auth/auth.service";

export async function revokeUserSession(sessionId: string) {
  const result = await AuthService.deleteSession({ sessionId });

  if (result.success) {
    revalidatePath("/dashboard/users");
  }

  return result;
}
