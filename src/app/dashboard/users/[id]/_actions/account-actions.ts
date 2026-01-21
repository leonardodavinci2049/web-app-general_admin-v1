"use server";

import { revalidatePath } from "next/cache";
import { AuthService } from "@/services/db/auth/auth.service";

export async function unlinkUserAccount(accountId: string) {
  const result = await AuthService.deleteAccount({ accountId });

  if (result.success) {
    revalidatePath("/dashboard/users");
  }

  return result;
}
