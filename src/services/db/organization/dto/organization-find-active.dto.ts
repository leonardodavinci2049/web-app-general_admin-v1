export interface OrganizationFindActiveDto {
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

  // Validação de campos numéricos (INT)
  if (dto.PE_LIMIT !== undefined && dto.PE_LIMIT !== null) {
    if (typeof dto.PE_LIMIT !== "number") {
      throw new Error("PE_LIMIT deve ser um número");
    }
  }

  return {
    PE_LIMIT:
      dto.PE_LIMIT !== undefined && dto.PE_LIMIT !== null
        ? Number(dto.PE_LIMIT)
        : undefined,
  };
}
