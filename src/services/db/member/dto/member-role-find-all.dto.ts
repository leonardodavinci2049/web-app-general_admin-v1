export interface MemberRoleFindAllDto {
  PE_ORGANIZATION_ID?: string;
  PE_USER_ID?: string;
  PE_LIMIT?: number;
}

/**
 * Valida o DTO para selecionar todos os membros com roles
 */
export function validateMemberRoleFindAllDto(
  data: unknown,
): MemberRoleFindAllDto {
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

  // Campos opcionais de string
  if (dto.PE_ORGANIZATION_ID !== undefined && dto.PE_ORGANIZATION_ID !== null) {
    if (typeof dto.PE_ORGANIZATION_ID !== "string") {
      throw new Error("PE_ORGANIZATION_ID deve ser uma string");
    }
    if (dto.PE_ORGANIZATION_ID.length > 191) {
      throw new Error("PE_ORGANIZATION_ID não pode exceder 191 caracteres");
    }
  }

  if (dto.PE_USER_ID !== undefined && dto.PE_USER_ID !== null) {
    if (typeof dto.PE_USER_ID !== "string") {
      throw new Error("PE_USER_ID deve ser uma string");
    }
    if (dto.PE_USER_ID.length > 191) {
      throw new Error("PE_USER_ID não pode exceder 191 caracteres");
    }
  }

  return {
    PE_ORGANIZATION_ID:
      typeof dto.PE_ORGANIZATION_ID === "string"
        ? dto.PE_ORGANIZATION_ID.trim()
        : undefined,
    PE_USER_ID:
      typeof dto.PE_USER_ID === "string" ? dto.PE_USER_ID.trim() : undefined,
    PE_LIMIT:
      dto.PE_LIMIT !== undefined && dto.PE_LIMIT !== null
        ? Number(dto.PE_LIMIT)
        : undefined,
  };
}
