"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import organizationService from "@/services/db/organization/organization.service";
import { createOrganizationSchema } from "./schema";

export type CreateOrganizationState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    slug?: string[];
    system_id?: string[];
  };
};

export async function createOrganizationAction(
  _prevState: CreateOrganizationState,
  formData: FormData,
): Promise<CreateOrganizationState> {
  const rawData = {
    name: formData.get("name"),
    system_id: formData.get("system_id"),
    slug: formData.get("slug"),
  };

  // Validate with Zod
  const validatedFields = createOrganizationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Falha na validação",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, slug, system_id } = validatedFields.data;

  // Validate for duplicates in database
  const checkResult =
    await organizationService.execOrganizationCheckTermsExistQuery({
      PE_SYSTEM_ID: system_id,
      PE_ORGANIZATION_NAME: name,
      PE_ORGANIZATION_SLUG: slug,
    });

  if (checkResult.errorId) {
    if (checkResult.errorId === 2) {
      return {
        success: false,
        message: "Já existe uma organização com este nome.",
        errors: { name: ["Nome já cadastrado"] },
      };
    }
    if (checkResult.errorId === 3) {
      return {
        success: false,
        message: "Já existe uma organização com este ID System.",
        errors: { system_id: ["ID System já cadastrado"] },
      };
    }
    if (checkResult.errorId === 4) {
      return {
        success: false,
        message: "Já existe uma organização com este Slug.",
        errors: { slug: ["Slug já cadastrado"] },
      };
    }
  }

  try {
    await auth.api.createOrganization({
      headers: await headers(),
      body: {
        name,
        slug,
        system_id,
      },
    });

    revalidatePath("/dashboard/organization");

    return {
      success: true,
      message: "Organização criada com sucesso",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Falha ao criar organização",
    };
  }
}
