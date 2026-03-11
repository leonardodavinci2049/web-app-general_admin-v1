"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import dbService from "@/lib/cnx-database/dbConnection";
import { AUTH_TABLES } from "@/lib/cnx-database/shared/auth/auth.types";

export async function updatePersonIdAction(
  userId: string,
  personId: number | null,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Não autenticado" };
  }

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permissions: { user: ["update"] } },
  });

  if (!hasAccess.success) {
    return { success: false, message: "Sem permissão para editar usuários" };
  }

  if (personId != null && (!Number.isInteger(personId) || personId < 0)) {
    return {
      success: false,
      message: "Person ID deve ser um número inteiro válido",
    };
  }

  try {
    await dbService.ModifyExecute(
      `UPDATE ${AUTH_TABLES.USER} SET person_id = ? WHERE id = ?`,
      [personId, userId],
    );

    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath("/dashboard/users");

    return { success: true, message: "Person ID atualizado com sucesso" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao atualizar Person ID",
    };
  }
}
