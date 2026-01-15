export interface OrganizationUpdSystemIdDto {
  PE_APP_ID: number;
  PE_USER_ID: string;
  PE_ORGANIZATION_ID: string;
  PE_SYSTEM_ID: number;
}

/**
 * Valida o DTO para atualizar o System ID da organização
 */
export function validateOrganizationUpdSystemIdDto(
  data: unknown,
): OrganizationUpdSystemIdDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação de campos numéricos (INT)
  if (typeof dto.PE_APP_ID !== "number") {
    throw new Error("PE_APP_ID é obrigatório e deve ser um número");
  }

  if (typeof dto.PE_SYSTEM_ID !== "number") {
    throw new Error("PE_SYSTEM_ID é obrigatório e deve ser um número");
  }

  // Validação de campos de string (varchar)
  if (typeof dto.PE_USER_ID !== "string" || dto.PE_USER_ID.trim() === "") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string válida");
  }

  if (
    typeof dto.PE_ORGANIZATION_ID !== "string" ||
    dto.PE_ORGANIZATION_ID.trim() === ""
  ) {
    throw new Error(
      "PE_ORGANIZATION_ID é obrigatório e deve ser uma string válida",
    );
  }

  // Verificação de comprimento máximo
  if (dto.PE_USER_ID.toString().length > 200) {
    throw new Error("PE_USER_ID não pode exceder 200 caracteres");
  }

  if (dto.PE_ORGANIZATION_ID.toString().length > 191) {
    throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
  }

  return {
    PE_APP_ID: Number(dto.PE_APP_ID),
    PE_USER_ID: (dto.PE_USER_ID as string).trim(),
    PE_ORGANIZATION_ID: (dto.PE_ORGANIZATION_ID as string).trim(),
    PE_SYSTEM_ID: Number(dto.PE_SYSTEM_ID),
  };
}
