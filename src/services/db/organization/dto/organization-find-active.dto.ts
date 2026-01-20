export interface OrganizationFindActiveDto {
  PE_USER_ID: string;
  PE_LIMIT?: number;
}

/**
 * Valida o DTO para selecionar organizações ativas
 */
export function validateOrganizationFindActiveDto(
  data: unknown,
): OrganizationFindActiveDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }
  const dto = (data as Record<string, unknown>) || {};

  // Validação de PE_USER_ID obrigatório
  if (!dto.PE_USER_ID || typeof dto.PE_USER_ID !== "string") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string");
  }

  // Validação de campos numéricos (INT)
  if (dto.PE_LIMIT !== undefined && dto.PE_LIMIT !== null) {
    if (typeof dto.PE_LIMIT !== "number") {
      throw new Error("PE_LIMIT deve ser um número");
    }
  }

  return {
    PE_USER_ID: String(dto.PE_USER_ID).trim(),
    PE_LIMIT:
      dto.PE_LIMIT !== undefined && dto.PE_LIMIT !== null
        ? Number(dto.PE_LIMIT)
        : undefined,
  };
}
