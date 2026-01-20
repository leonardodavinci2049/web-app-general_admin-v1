"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getUserId } from "@/lib/auth/get-user-id";
import organizationService from "@/services/db/organization/organization.service";

export async function deleteOrganizationAction(organizationId: string) {
  try {
    await auth.api.deleteOrganization({
      headers: await headers(),
      body: {
        organizationId,
      },
    });

    revalidatePath("/dashboard/organization");
    return { success: true, message: "Organization deleted successfully" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to delete organization",
    };
  }
}

export async function updateOrganizationNameAction(
  organizationId: string,
  name: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getUserId();
    const result = await organizationService.execOrganizationUpdateNameQuery({
      PE_USER_ID: userId,
      PE_ORGANIZATION_ID: organizationId,
      PE_ORGANIZATION_NAME: name,
    });

    if (result.statusCode === 200 || result.statusCode === 100200) {
      // Revalidate both the list and the potential details page
      revalidatePath("/dashboard/organization");
      revalidatePath("/dashboard/organization/[slug]", "layout");
      return {
        success: true,
        message: "Nome da organização atualizado com sucesso",
      };
    } else {
      return {
        success: false,
        message: result.message || "Erro ao atualizar nome da organização",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
