export interface OrganizationCheckNameExistDto {
  PE_APP_ID?: number;
  PE_USER_ID: string;
  PE_TERM: string;
}

/**
 * Valida o DTO para verificar a existência do nome da organização
 */
export function validateOrganizationCheckNameExistDto(
  data: unknown,
): OrganizationCheckNameExistDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação do PE_APP_ID (opcional)
  if (dto.PE_APP_ID !== undefined && dto.PE_APP_ID !== null) {
    if (typeof dto.PE_APP_ID !== "number") {
      throw new Error("PE_APP_ID deve ser um número");
    }
  }

  // Validação do PE_USER_ID (obrigatório)
  if (typeof dto.PE_USER_ID !== "string" || dto.PE_USER_ID.trim() === "") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string válida");
  }

  // Validação do PE_TERM (obrigatório)
  if (typeof dto.PE_TERM !== "string" || dto.PE_TERM.trim() === "") {
    throw new Error("PE_TERM é obrigatório e deve ser uma string válida");
  }

  return {
    PE_APP_ID: dto.PE_APP_ID ? Number(dto.PE_APP_ID) : undefined,
    PE_USER_ID: (dto.PE_USER_ID as string).trim(),
    PE_TERM: (dto.PE_TERM as string).trim(),
  };
}
