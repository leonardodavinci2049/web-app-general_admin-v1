export interface OrganizationCheckSystemIdExistDto {
  PE_USER_ID: string;
  PE_TERM: string;
}

/**
 * Valida o DTO para verificar a existência do System ID da organização
 */
export function validateOrganizationCheckSystemIdExistDto(
  data: unknown,
): OrganizationCheckSystemIdExistDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação de PE_USER_ID obrigatório
  if (!dto.PE_USER_ID || typeof dto.PE_USER_ID !== "string") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string");
  }

  // Validação do PE_TERM (obrigatório)
  if (typeof dto.PE_TERM !== "string" || dto.PE_TERM.trim() === "") {
    throw new Error("PE_TERM é obrigatório e deve ser uma string válida");
  }

  if (dto.PE_TERM.toString().length > 200) {
    throw new Error("PE_TERM não pode exceder 200 caracteres");
  }

  return {
    PE_USER_ID: String(dto.PE_USER_ID).trim(),
    PE_TERM: (dto.PE_TERM as string).trim(),
  };
}
