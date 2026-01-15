export interface OrganizationSelActiveDto {
  PE_APP_ID: number;
  PE_USER_ID: string;
}

/**
 * Valida o DTO para selecionar organizações ativas
 */
export function validateOrganizationSelActiveDto(
  data: unknown,
): OrganizationSelActiveDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação de campos numéricos (INT)
  if (typeof dto.PE_APP_ID !== "number") {
    throw new Error("PE_APP_ID é obrigatório e deve ser um número");
  }

  // Validação de campos de string (varchar)
  if (typeof dto.PE_USER_ID !== "string" || dto.PE_USER_ID.trim() === "") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string válida");
  }

  // Verificação de comprimento máximo (varchar(191))
  if (dto.PE_USER_ID.length > 191) {
    throw new Error("PE_USER_ID não pode exceder 191 caracteres");
  }

  return {
    PE_APP_ID: Number(dto.PE_APP_ID),
    PE_USER_ID: (dto.PE_USER_ID as string).trim(),
  };
}
