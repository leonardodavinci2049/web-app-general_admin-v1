export type OrganizationSelActiveDto = Record<string, never>;

/**
 * Valida o DTO para selecionar organizações ativas
 */
export function validateOrganizationSelActiveDto(
  data: unknown,
): OrganizationSelActiveDto {
  if (data !== undefined && data !== null && typeof data !== "object") {
    throw new Error("Dados inválidos fornecidos");
  }

  return {};
}
