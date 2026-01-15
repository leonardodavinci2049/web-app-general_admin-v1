export interface OrganizationSelAllDto {
  PE_APP_ID: number;
  PE_USER_ID: string;
  PE_ORGANIZATION_ID?: string;
  PE_ORGANIZATION?: string;
  PE_LIMIT?: number;
}

/**
 * Valida o DTO para selecionar todas as organizações
 */
export function validateOrganizationSelAllDto(
  data: unknown,
): OrganizationSelAllDto {
  if (!data || typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  const dto = data as Record<string, unknown>;

  // Validação de campos numéricos (INT)
  if (typeof dto.PE_APP_ID !== "number") {
    throw new Error("PE_APP_ID é obrigatório e deve ser um número");
  }

  if (dto.PE_LIMIT !== undefined && dto.PE_LIMIT !== null) {
    if (typeof dto.PE_LIMIT !== "number") {
      throw new Error("PE_LIMIT deve ser um número");
    }
  }

  // Validação de campos de string (varchar)
  if (typeof dto.PE_USER_ID !== "string" || dto.PE_USER_ID.trim() === "") {
    throw new Error("PE_USER_ID é obrigatório e deve ser uma string válida");
  }

  // Verificação de comprimento máximo (varchar(191))
  if (dto.PE_USER_ID.length > 191) {
    throw new Error("PE_USER_ID não pode exceder 191 caracteres");
  }

  // Campos opcionais de string
  if (dto.PE_ORGANIZATION_ID !== undefined && dto.PE_ORGANIZATION_ID !== null) {
    if (typeof dto.PE_ORGANIZATION_ID !== "string") {
      throw new Error("PE_ORGANIZATION_ID deve ser uma string");
    }
    if (dto.PE_ORGANIZATION_ID.length > 191) {
      throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
    }
  }

  if (dto.PE_ORGANIZATION !== undefined && dto.PE_ORGANIZATION !== null) {
    if (typeof dto.PE_ORGANIZATION !== "string") {
      throw new Error("PE_ORGANIZATION deve ser uma string");
    }
    if (dto.PE_ORGANIZATION.length > 191) {
      throw new Error("PE_ORGANIZATION não pode exceder 191 caracteres");
    }
  }

  return {
    PE_APP_ID: Number(dto.PE_APP_ID),
    PE_USER_ID: (dto.PE_USER_ID as string).trim(),
    PE_ORGANIZATION_ID: dto.PE_ORGANIZATION_ID
      ? (dto.PE_ORGANIZATION_ID as string).trim()
      : undefined,
    PE_ORGANIZATION: dto.PE_ORGANIZATION
      ? (dto.PE_ORGANIZATION as string).trim()
      : undefined,
    PE_LIMIT: dto.PE_LIMIT !== undefined ? Number(dto.PE_LIMIT) : undefined,
  };
}
