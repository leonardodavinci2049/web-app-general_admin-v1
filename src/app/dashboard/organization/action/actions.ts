"use server";

import { existsSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import type { OrganizationMemberRole } from "@/database/schema";
import { auth } from "@/lib/auth/auth";
import { getUserId } from "@/lib/auth/get-user-id";
import { CACHE_TAGS } from "@/lib/cache-config";
import { MemberAuthService } from "@/services/member/member.service";
import organizationService from "@/services/organization/organization.service";
import OrganizationMetaService from "@/services/organization-meta/organization-meta.service";
import {
  META_KEY_CONFIG,
  VALID_SETTINGS_META_KEYS,
} from "../[slug]/_components/organization-settings-config";

const VALID_IMAGE_KEYS = [
  "image1",
  "image2",
  "image3",
  "image4",
  "image5",
] as const;

async function removeExistingFileForKey(
  dirPath: string,
  imageKey: string,
): Promise<void> {
  if (!existsSync(dirPath)) return;

  const files = await readdir(dirPath);
  for (const file of files) {
    if (file.startsWith(`${imageKey}.`)) {
      await rm(join(dirPath, file));
    }
  }
}

export async function addMemberAction(
  userId: string,
  role: OrganizationMemberRole,
  organizationId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const memberships = await MemberAuthService.findMembersByUser({ userId });

    if (
      memberships.success &&
      memberships.data &&
      memberships.data.length > 0
    ) {
      return {
        success: false,
        message: "Este usuário já pertence a outra organização",
      };
    }

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

export async function uploadOrganizationImageAction(
  organizationId: string,
): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  revalidateTag(CACHE_TAGS.organizationMeta(organizationId), "hours");
  revalidateTag(CACHE_TAGS.organizationMetaCollection, "hours");
  revalidatePath("/dashboard/organization/[slug]", "page");
}

export async function deleteOrganizationImageAction(
  organizationId: string,
  imageKey: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, message: "Não autorizado" };
    }

    if (
      !VALID_IMAGE_KEYS.includes(imageKey as (typeof VALID_IMAGE_KEYS)[number])
    ) {
      return { success: false, message: "imageKey inválida" };
    }

    const dirPath = join(
      process.cwd(),
      "public",
      "upload",
      "image",
      "organization",
      organizationId,
    );
    await removeExistingFileForKey(dirPath, imageKey);

    await OrganizationMetaService.updateOrganizationMeta({
      organizationId,
      metaKey: imageKey,
      metaValue: "",
    });

    revalidateTag(CACHE_TAGS.organizationMeta(organizationId), "hours");
    revalidateTag(CACHE_TAGS.organizationMetaCollection, "hours");
    revalidatePath("/dashboard/organization/[slug]", "page");

    return { success: true, message: "Imagem excluída com sucesso" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Erro ao excluir imagem" };
  }
}

export async function upsertOrganizationMetaAction(
  organizationId: string,
  metaKey: string,
  metaValue: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, message: "Não autorizado" };
    }

    if (!VALID_SETTINGS_META_KEYS.includes(metaKey)) {
      return { success: false, message: "Chave de configuração inválida" };
    }

    const config = META_KEY_CONFIG[metaKey];
    let sanitizedValue = metaValue.trim();

    if (config) {
      switch (config.type) {
        case "digits":
          sanitizedValue = sanitizedValue.replace(/\D/g, "");
          break;
        case "email":
          if (sanitizedValue !== "") {
            const emailResult = z.string().email().safeParse(sanitizedValue);
            if (!emailResult.success) {
              return { success: false, message: "E-mail inválido" };
            }
          }
          break;
        case "select":
          if (config.options) {
            const validValues = config.options.map((o) => o.value);
            if (!validValues.includes(sanitizedValue)) {
              return { success: false, message: "Valor selecionado inválido" };
            }
          }
          break;
      }
    }

    const updateResult = await OrganizationMetaService.updateOrganizationMeta({
      organizationId,
      metaKey,
      metaValue: sanitizedValue,
    });

    if (updateResult.affectedRows === 0) {
      await OrganizationMetaService.createOrganizationMeta({
        organizationId,
        metaKey,
        metaValue: sanitizedValue,
      });
    }

    revalidateTag(CACHE_TAGS.organizationMeta(organizationId), "hours");
    revalidateTag(
      CACHE_TAGS.organizationMetaKey(organizationId, metaKey),
      "hours",
    );
    revalidateTag(CACHE_TAGS.organizationMetaCollection, "hours");
    revalidatePath("/dashboard/organization/[slug]", "page");

    return { success: true, message: "Configuração salva com sucesso" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Erro ao salvar configuração",
    };
  }
}
