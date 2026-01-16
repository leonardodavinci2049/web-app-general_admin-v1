export interface OrganizationCheckTermsExistDto {
  PE_SYSTEM_ID: number;
  PE_ORGANIZATION_NAME: string;
  PE_ORGANIZATION_SLUG: string;
}

/**
 * Valida o DTO para verificar a existência dos termos da organização (System ID, Nome e Slug)
 */
export function validateOrganizationCheckTermsExistDto(
  data: unknown,
): OrganizationCheckTermsExistDto {
  if (!data || typeof data !== "object" || data === null) {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação do PE_SYSTEM_ID (obrigatório)
  if (
    dto.PE_SYSTEM_ID === undefined ||
    dto.PE_SYSTEM_ID === null ||
    typeof dto.PE_SYSTEM_ID !== "number"
  ) {
    throw new Error("PE_SYSTEM_ID é obrigatório e deve ser um número");
  }

  // Validação do PE_ORGANIZATION_NAME (obrigatório)
  if (
    typeof dto.PE_ORGANIZATION_NAME !== "string" ||
    dto.PE_ORGANIZATION_NAME.trim() === ""
  ) {
    throw new Error(
      "PE_ORGANIZATION_NAME é obrigatório e deve ser uma string válida",
    );
  }

  if (dto.PE_ORGANIZATION_NAME.length > 200) {
    throw new Error("PE_ORGANIZATION_NAME não pode exceder 200 caracteres");
  }

  // Validação do PE_ORGANIZATION_SLUG (obrigatório)
  if (
    typeof dto.PE_ORGANIZATION_SLUG !== "string" ||
    dto.PE_ORGANIZATION_SLUG.trim() === ""
  ) {
    throw new Error(
      "PE_ORGANIZATION_SLUG é obrigatório e deve ser uma string válida",
    );
  }

  if (dto.PE_ORGANIZATION_SLUG.length > 200) {
    throw new Error("PE_ORGANIZATION_SLUG não pode exceder 200 caracteres");
  }

  return {
    PE_SYSTEM_ID: dto.PE_SYSTEM_ID as number,
    PE_ORGANIZATION_NAME: (dto.PE_ORGANIZATION_NAME as string).trim(),
    PE_ORGANIZATION_SLUG: (dto.PE_ORGANIZATION_SLUG as string).trim(),
  };
}
