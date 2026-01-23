"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getUserId } from "@/lib/auth/get-user-id";
import organizationService from "@/services/db/organization/organization.service";
import type { OrganizationMemberRole } from "@/services/db/schema";

export async function addMemberAction(
  userId: string,
  role: OrganizationMemberRole,
  organizationId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await auth.api.addMember({
      headers: await headers(),
      body: {
        userId,
        role,
        organizationId,
      },
    });

    if (result) {
      revalidatePath("/dashboard/organization/[slug]", "page");
      return { success: true, message: "Member added successfully" };
    } else {
      return { success: false, message: "Failed to add member" };
    }
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to add member",
    };
  }
}

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

export async function updateOrganizationSlugAction(
  organizationId: string,
  slug: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getUserId();
    const result = await organizationService.execOrganizationUpdateSlugQuery({
      PE_USER_ID: userId,
      PE_ORGANIZATION_ID: organizationId,
      PE_ORGANIZATION_SLUG: slug,
    });

    if (result.statusCode === 200 || result.statusCode === 100200) {
      revalidatePath("/dashboard/organization");
      revalidatePath("/dashboard/organization/[slug]", "layout");
      return {
        success: true,
        message: "Slug da organização atualizado com sucesso",
      };
    } else {
      return {
        success: false,
        message: result.message || "Erro ao atualizar slug da organização",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function updateOrganizationSystemIdAction(
  organizationId: string,
  systemId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getUserId();
    const result =
      await organizationService.execOrganizationUpdateSystemIdQuery({
        PE_USER_ID: userId,
        PE_ORGANIZATION_ID: organizationId,
        PE_SYSTEM_ID: systemId,
      });

    if (result.statusCode === 200 || result.statusCode === 100200) {
      revalidatePath("/dashboard/organization");
      revalidatePath("/dashboard/organization/[slug]", "layout");
      return {
        success: true,
        message: "ID do Sistema atualizado com sucesso",
      };
    } else {
      return {
        success: false,
        message: result.message || "Erro ao atualizar ID do Sistema",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
