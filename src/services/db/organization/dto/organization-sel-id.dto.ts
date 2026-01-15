export interface OrganizationSelIdDto {
  PE_ORGANIZATION_ID: string;
}

/**
 * Valida o DTO para selecionar uma organização por ID
 */
export function validateOrganizationSelIdDto(
  data: unknown,
): OrganizationSelIdDto {
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

  // Verificação de comprimento máximo (varchar(191))
  if (dto.PE_ORGANIZATION_ID.length > 191) {
    throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
  }

  return {
    PE_ORGANIZATION_ID: (dto.PE_ORGANIZATION_ID as string).trim(),
  };
}
