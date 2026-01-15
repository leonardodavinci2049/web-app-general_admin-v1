export interface OrganizationUpdNameDto {
  PE_ORGANIZATION_ID: string;
  PE_ORGANIZATION_NAME: string;
}

/**
 * Valida o DTO para atualizar o nome da organização
 */
export function validateOrganizationUpdNameDto(
  data: unknown,
): OrganizationUpdNameDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação de campos de string (varchar)
  if (
    typeof dto.PE_ORGANIZATION_ID !== "string" ||
    dto.PE_ORGANIZATION_ID.trim() === ""
  ) {
    throw new Error(
      "PE_ORGANIZATION_ID é obrigatório e deve ser uma string válida",
    );
  }

  if (
    typeof dto.PE_ORGANIZATION_NAME !== "string" ||
    dto.PE_ORGANIZATION_NAME.trim() === ""
  ) {
    throw new Error(
      "PE_ORGANIZATION_NAME é obrigatório e deve ser uma string válida",
    );
  }

  // Verificação de comprimento máximo
  if (dto.PE_ORGANIZATION_ID.toString().length > 191) {
    throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
  }

  if (dto.PE_ORGANIZATION_NAME.toString().length > 200) {
    throw new Error("PE_ORGANIZATION_NAME não pode exceder 200 caracteres");
  }

  return {
    PE_ORGANIZATION_ID: (dto.PE_ORGANIZATION_ID as string).trim(),
    PE_ORGANIZATION_NAME: (dto.PE_ORGANIZATION_NAME as string).trim(),
  };
}
