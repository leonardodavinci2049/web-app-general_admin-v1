import { z } from "zod";
import { MESSAGES } from "@/core/constants/globalConstants";

import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/lib/cnx-database/dbConnection";
import {
  AUTH_TABLES,
  AuthValidationError,
  type MemberWithUserEntity,
  mapMemberWithUserEntityToDto,
  mapOrganizationEntityToDto,
  type Organization,
  type OrganizationEntity,
  type OrganizationWithMembers,
  type ServiceResponse,
} from "@/lib/cnx-database/shared/auth/auth.types";
import { processProcedureResultMutation } from "@/lib/cnx-database/utils/process-procedure-result.mutation";
import { processProcedureResultQuery } from "@/lib/cnx-database/utils/process-procedure-result.query";
import { ResultModel } from "@/lib/cnx-database/utils/result.model";
import { validateOrganizationCheckNameExistDto } from "./dto/organization-check-name-exist.dto";
import { validateOrganizationCheckSlugExistDto } from "./dto/organization-check-slug-exist.dto";
import { validateOrganizationCheckSystemIdExistDto } from "./dto/organization-check-systen-id-exist.dto";
import { validateOrganizationCheckTermsExistDto } from "./dto/organization-check-terms-exist.dto";
import { validateOrganizationCreateDto } from "./dto/organization-create.dto";
import { validateOrganizationDeleteDto } from "./dto/organization-delete.dto";
import { validateOrganizationFindActiveDto } from "./dto/organization-find-active.dto";
import { validateOrganizationFindAllDto } from "./dto/organization-find-all.dto";
import { validateOrganizationFindByIdDto } from "./dto/organization-find-by-id.dto";
import { validateOrganizationUpdNameDto } from "./dto/organization-upd-name.dto";
import { validateOrganizationUpdSlugDto } from "./dto/organization-upd-slug.dto";
import { validateOrganizationUpdSystemIdDto } from "./dto/organization-upd-system-id.dto";
import { OrganizationCheckNameExistQuery } from "./query/organization-check-name-exist.query";
import { OrganizationCheckSlugExistQuery } from "./query/organization-check-slug-exist.query";
import { OrganizationCheckSystenIdExistQuery } from "./query/organization-check-systen-id-exist.query";
import { OrganizationCheckTermsExistQuery } from "./query/organization-check-terms-exist.query";
import { OrganizationCreateQuery } from "./query/organization-create.query";
import { OrganizationDeleteQuery } from "./query/organization-delete.query";
import { OrganizationFindActiveQuery } from "./query/organization-find-active.query";
import { OrganizationFindAllQuery } from "./query/organization-find-all.query";
import { OrganizationFindByIdQuery } from "./query/organization-find-by-id.query";
import { OrganizationUpdNameQuery } from "./query/organization-upd-name.query";
import { OrganizationUpdSlugQuery } from "./query/organization-upd-slug.query";
import { OrganizationUpdSystemIdQuery } from "./query/organization-upd-system-id.query";
import type {
  SpResultRecordActiveType,
  SpResultRecordCheckExistType,
  SpResultRecordCreateType,
  SpResultRecordDeleteType,
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  SpResultRecordUpdateType,
  TblOrganizationActive,
  TblOrganizationFind,
  TblOrganizationFindById,
} from "./types/organization.type";

export class OrganizationService {
  // ============================================================================
  // buscar organização
  // ============================================================================

  async execOrganizationFindByIdQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationFindByIdDto(dataJsonDto);

      const queryString = await OrganizationFindByIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindByIdType;

      return processProcedureResultQuery<TblOrganizationFindById>(
        resultData as unknown[],
        "Organization not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationFindAllQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationFindAllDto(dataJsonDto);

      const queryString = await OrganizationFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindType;

      return processProcedureResultQuery<TblOrganizationFind>(
        resultData as unknown[],
        "Organization not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationFindActiveQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationFindActiveDto(dataJsonDto);

      const queryString = await OrganizationFindActiveQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordActiveType;

      return processProcedureResultQuery<TblOrganizationActive>(
        resultData as unknown[],
        "No active organization found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // verificar se termos da organização existe
  // ============================================================================

  async execOrganizationCheckTermsExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCheckTermsExistDto(dataJsonDto);

      const queryString = await OrganizationCheckTermsExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "No active organization found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationCheckNameExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCheckNameExistDto(dataJsonDto);

      const queryString = await OrganizationCheckNameExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization name check failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationCheckSlugExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCheckSlugExistDto(dataJsonDto);

      const queryString = await OrganizationCheckSlugExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization slug check failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationCheckSystenIdExistQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto =
        validateOrganizationCheckSystemIdExistDto(dataJsonDto);

      const queryString =
        await OrganizationCheckSystenIdExistQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCheckExistType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization System ID check failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // criar organização
  // ============================================================================

  async execOrganizationCreateQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationCreateDto(dataJsonDto);

      const queryString = await OrganizationCreateQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization create failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // atualizar termos da organização
  // ============================================================================

  async execOrganizationUpdateNameQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationUpdNameDto(dataJsonDto);

      const queryString = await OrganizationUpdNameQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization update name failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationUpdateSlugQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationUpdSlugDto(dataJsonDto);

      const queryString = await OrganizationUpdSlugQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization update slug failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execOrganizationUpdateSystemIdQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationUpdSystemIdDto(dataJsonDto);

      const queryString = await OrganizationUpdSystemIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization update system ID failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
  // ============================================================================
  // deletar organização
  // ============================================================================
  async execOrganizationDeleteQuery(
    dataJsonDto: unknown,
  ): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateOrganizationDeleteDto(dataJsonDto);

      const queryString = await OrganizationDeleteQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordDeleteType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Organization delete failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

// Instância singleton do serviço de organização
const organizationService = new OrganizationService();
export default organizationService;

// ============================================================================
// Auth Organization Methods (migrated from auth.service.ts)
// ============================================================================

const IdSchema = z
  .string()
  .min(1, "ID é obrigatório")
  .max(128, "ID muito longo");
const IdArraySchema = z.array(IdSchema);
const SlugSchema = z
  .string()
  .min(1, "Slug é obrigatório")
  .max(255, "Slug muito longo")
  .regex(/^[a-z0-9-]+$/, "Slug inválido");

function validateId(id: string, fieldName: string): void {
  const result = IdSchema.safeParse(id);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function validateIdArray(ids: string[], fieldName: string): void {
  const result = IdArraySchema.safeParse(ids);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function validateSlug(slug: string, fieldName: string): void {
  const result = SlugSchema.safeParse(slug);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function handleError<T>(error: unknown, operation: string): ServiceResponse<T> {
  console.error(`[OrganizationAuthService] Erro em ${operation}:`, error);

  if (error instanceof AuthValidationError) {
    return { success: false, data: null, error: error.message };
  }

  if (error instanceof ErroConexaoBancoDados) {
    return {
      success: false,
      data: null,
      error: "Erro de conexão com o banco de dados",
    };
  }

  if (error instanceof ErroExecucaoConsulta) {
    return {
      success: false,
      data: null,
      error: "Erro ao processar a consulta no banco de dados",
    };
  }

  return {
    success: false,
    data: null,
    error: "Ocorreu um erro interno inesperado",
  };
}

async function findOrganizationById(params: {
  organizationId: string;
}): Promise<ServiceResponse<Organization | null>> {
  try {
    validateId(params.organizationId, "organizationId");

    const query = `
      SELECT 
        id, name, slug, logo, createdAt, metadata
      FROM ${AUTH_TABLES.ORGANIZATION}
      WHERE id = ?
      LIMIT 1
    `;

    const results = await dbService.selectExecute<OrganizationEntity>(query, [
      params.organizationId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapOrganizationEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<Organization | null>(error, "findOrganizationById");
  }
}

async function findOrganizationsByIds(params: {
  organizationIds: string[];
}): Promise<ServiceResponse<Organization[]>> {
  try {
    validateIdArray(params.organizationIds, "organizationIds");

    if (params.organizationIds.length === 0) {
      return { success: true, data: [], error: null };
    }

    const placeholders = params.organizationIds.map(() => "?").join(", ");

    const query = `
      SELECT 
        id, name, slug, logo, createdAt, metadata
      FROM ${AUTH_TABLES.ORGANIZATION}
      WHERE id IN (${placeholders})
      ORDER BY name ASC
    `;

    const results = await dbService.selectExecute<OrganizationEntity>(
      query,
      params.organizationIds,
    );

    return {
      success: true,
      data: results.map(mapOrganizationEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Organization[]>(error, "findOrganizationsByIds");
  }
}

async function findAllOrganizations(): Promise<
  ServiceResponse<Organization[]>
> {
  try {
    const query = `
      SELECT 
        id, name, slug, logo, createdAt, metadata
      FROM ${AUTH_TABLES.ORGANIZATION}
      ORDER BY name ASC
    `;

    const results = await dbService.selectExecute<OrganizationEntity>(query);

    return {
      success: true,
      data: results.map(mapOrganizationEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Organization[]>(error, "findAllOrganizations");
  }
}

async function findOrganizationBySlug(params: {
  slug: string;
}): Promise<ServiceResponse<Organization | null>> {
  try {
    validateSlug(params.slug, "slug");

    const query = `
      SELECT 
        id, name, slug, logo, createdAt, metadata
      FROM ${AUTH_TABLES.ORGANIZATION}
      WHERE slug = ?
      LIMIT 1
    `;

    const results = await dbService.selectExecute<OrganizationEntity>(query, [
      params.slug,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapOrganizationEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<Organization | null>(error, "findOrganizationBySlug");
  }
}

async function findOrganizationBySlugWithMembers(params: {
  slug: string;
}): Promise<ServiceResponse<OrganizationWithMembers | null>> {
  try {
    validateSlug(params.slug, "slug");

    const orgQuery = `
      SELECT 
        id, name, slug, logo, createdAt, metadata
      FROM ${AUTH_TABLES.ORGANIZATION}
      WHERE slug = ?
      LIMIT 1
    `;

    const orgResults = await dbService.selectExecute<OrganizationEntity>(
      orgQuery,
      [params.slug],
    );

    if (orgResults.length === 0) {
      return { success: true, data: null, error: null };
    }

    const organization = mapOrganizationEntityToDto(orgResults[0]);

    const membersQuery = `
      SELECT 
        m.id, m.organizationId, m.userId, m.role, m.createdAt, m.updatedAt,
        u.id as user_id, u.name as user_name, u.email as user_email,
        u.emailVerified as user_emailVerified, u.image as user_image,
        u.createdAt as user_createdAt, u.updatedAt as user_updatedAt,
        u.twoFactorEnabled as user_twoFactorEnabled, u.role as user_role,
        u.banned as user_banned, u.banReason as user_banReason,
        u.banExpires as user_banExpires
      FROM ${AUTH_TABLES.MEMBER} m
      INNER JOIN ${AUTH_TABLES.USER} u ON m.userId = u.id
      WHERE m.organizationId = ?
      ORDER BY m.createdAt ASC
    `;

    const memberResults = await dbService.selectExecute<MemberWithUserEntity>(
      membersQuery,
      [organization.id],
    );

    const membersWithUsers = memberResults.map(mapMemberWithUserEntityToDto);

    return {
      success: true,
      data: {
        ...organization,
        member: membersWithUsers,
      },
      error: null,
    };
  } catch (error) {
    return handleError<OrganizationWithMembers | null>(
      error,
      "findOrganizationBySlugWithMembers",
    );
  }
}

async function findUserOrganizations(params: {
  userId: string;
}): Promise<ServiceResponse<Organization[]>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT DISTINCT
        o.id, o.name, o.slug, o.logo, o.createdAt, o.metadata
      FROM ${AUTH_TABLES.ORGANIZATION} o
      INNER JOIN ${AUTH_TABLES.MEMBER} m ON o.id = m.organizationId
      WHERE m.userId = ?
      ORDER BY o.name ASC
    `;

    const results = await dbService.selectExecute<OrganizationEntity>(query, [
      params.userId,
    ]);

    return {
      success: true,
      data: results.map(mapOrganizationEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Organization[]>(error, "findUserOrganizations");
  }
}

async function findActiveOrganization(params: {
  userId: string;
}): Promise<ServiceResponse<Organization | null>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        o.id, o.name, o.slug, o.logo, o.createdAt, o.metadata
      FROM ${AUTH_TABLES.ORGANIZATION} o
      INNER JOIN ${AUTH_TABLES.MEMBER} m ON o.id = m.organizationId
      WHERE m.userId = ?
      ORDER BY m.createdAt ASC
      LIMIT 1
    `;

    const results = await dbService.selectExecute<OrganizationEntity>(query, [
      params.userId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapOrganizationEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<Organization | null>(error, "findActiveOrganization");
  }
}

export const OrganizationAuthService = {
  findOrganizationById,
  findOrganizationsByIds,
  findAllOrganizations,
  findOrganizationBySlug,
  findOrganizationBySlugWithMembers,
  findUserOrganizations,
  findActiveOrganization,
} as const;

export type {
  Organization,
  OrganizationWithMembers,
  ServiceResponse,
} from "@/lib/cnx-database/shared/auth/auth.types";
