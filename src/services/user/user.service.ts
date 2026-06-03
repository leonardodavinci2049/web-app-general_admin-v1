import { z } from "zod";
import { MESSAGES } from "@/core/constants/globalConstants";

import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/database/dbConnection";
import {
  AUTH_TABLES,
  AuthValidationError,
  type ModifyResponse,
  mapUserEntityToDto,
  type ServiceResponse,
  type User,
  type UserEntity,
} from "@/database/shared/auth/auth.types";
import { processProcedureResultMutation } from "@/database/utils/process-procedure-result.mutation";
import { processProcedureResultQuery } from "@/database/utils/process-procedure-result.query";
import { ResultModel } from "@/database/utils/result.model";
import { validateUserFindAllDto } from "./dto/user_find_all.dto";
import { validateUserFindIdDto } from "./dto/user_find_id.dto";
import { validateUserUpdNameDto } from "./dto/user_upd_name.dto";
import { UserFindAllQuery } from "./query/user_find_all.query";
import { UserFindIdQuery } from "./query/user_find_id.query";
import { UserFindWithOrgQuery } from "./query/user_find_with_org.query";
import { UserUpdNameQuery } from "./query/user_upd_name.query";
import type {
  SpResultRecordFindByIdType,
  SpResultRecordFindType,
  SpResultRecordUpdateType,
  TblUserFindAll,
  TblUserFindById,
  TblUserFindWithOrg,
} from "./types/user.type";

export class UserService {
  async execUserFindIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserFindIdDto(dataJsonDto);

      const queryString = await UserFindIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindByIdType;

      return processProcedureResultQuery<TblUserFindById>(
        resultData as unknown[],
        "User not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserFindAllDto(dataJsonDto);

      const queryString = await UserFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordFindType;

      return processProcedureResultQuery<TblUserFindAll>(
        resultData as unknown[],
        "Users not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execUserUpdNameQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateUserUpdNameDto(dataJsonDto);

      const queryString = await UserUpdNameQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "User name update failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const userService = new UserService();
export default userService;

// ============================================================================
// Auth User Methods (migrated from auth.service.ts)
// ============================================================================

const IdSchema = z
  .string()
  .min(1, "ID é obrigatório")
  .max(128, "ID muito longo");
const IdArraySchema = z.array(IdSchema);

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

function handleError<T>(error: unknown, operation: string): ServiceResponse<T> {
  console.error(`[UserAuthService] Erro em ${operation}:`, error);

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

async function findUserById(params: {
  userId: string;
}): Promise<ServiceResponse<User>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id, name, email, emailVerified, image, 
        createdAt, updatedAt, twoFactorEnabled, 
        role, banned, banReason, banExpires
      FROM ${AUTH_TABLES.USER}
      WHERE id = ?
      LIMIT 1
    `;

    const results = await dbService.selectExecute<UserEntity>(query, [
      params.userId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapUserEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<User>(error, "findUserById");
  }
}

async function findUsersExcludingIds(params: {
  excludeUserIds: string[];
}): Promise<ServiceResponse<User[]>> {
  try {
    validateIdArray(params.excludeUserIds, "excludeUserIds");

    if (params.excludeUserIds.length === 0) {
      const query = `
        SELECT 
          id, name, email, emailVerified, image, 
          createdAt, updatedAt, twoFactorEnabled, 
          role, banned, banReason, banExpires
        FROM ${AUTH_TABLES.USER}
        ORDER BY name ASC
      `;

      const results = await dbService.selectExecute<UserEntity>(query);
      return {
        success: true,
        data: results.map(mapUserEntityToDto),
        error: null,
      };
    }

    const placeholders = params.excludeUserIds.map(() => "?").join(", ");

    const query = `
      SELECT 
        id, name, email, emailVerified, image, 
        createdAt, updatedAt, twoFactorEnabled, 
        role, banned, banReason, banExpires
      FROM ${AUTH_TABLES.USER}
      WHERE id NOT IN (${placeholders})
      ORDER BY name ASC
    `;

    const results = await dbService.selectExecute<UserEntity>(
      query,
      params.excludeUserIds,
    );

    return {
      success: true,
      data: results.map(mapUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<User[]>(error, "findUsersExcludingIds");
  }
}

async function findNonMemberUsers(params: {
  organizationId: string;
}): Promise<ServiceResponse<User[]>> {
  try {
    validateId(params.organizationId, "organizationId");

    const query = `
      SELECT 
        u.id, u.name, u.email, u.emailVerified, u.image, 
        u.createdAt, u.updatedAt, u.twoFactorEnabled, 
        u.role, u.banned, u.banReason, u.banExpires
      FROM ${AUTH_TABLES.USER} u
      WHERE u.id NOT IN (
        SELECT m.userId 
        FROM ${AUTH_TABLES.MEMBER} m 
        WHERE m.organizationId = ?
      )
      ORDER BY u.name ASC
    `;

    const results = await dbService.selectExecute<UserEntity>(query, [
      params.organizationId,
    ]);

    return {
      success: true,
      data: results.map(mapUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<User[]>(error, "findNonMemberUsers");
  }
}

async function findUsersWithoutAnyOrganization(): Promise<
  ServiceResponse<User[]>
> {
  try {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.emailVerified, u.image, 
        u.createdAt, u.updatedAt, u.twoFactorEnabled, 
        u.role, u.banned, u.banReason, u.banExpires
      FROM ${AUTH_TABLES.USER} u
      WHERE u.id NOT IN (
        SELECT DISTINCT m.userId 
        FROM ${AUTH_TABLES.MEMBER} m
      )
      ORDER BY u.name ASC
    `;

    const results = await dbService.selectExecute<UserEntity>(query);

    return {
      success: true,
      data: results.map(mapUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<User[]>(error, "findUsersWithoutAnyOrganization");
  }
}

async function updateUserName(params: {
  userId: string;
  name: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.userId, "userId");

    if (!params.name || typeof params.name !== "string") {
      throw new AuthValidationError(
        "name é obrigatório e deve ser uma string",
        "name",
      );
    }

    const query = `
      UPDATE ${AUTH_TABLES.USER}
      SET name = ?
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [
      params.name.trim(),
      params.userId,
    ]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error: result.affectedRows === 0 ? "Usuário não encontrado" : null,
    };
  } catch (error) {
    console.error(`[UserAuthService] Erro em updateUserName:`, error);

    if (error instanceof AuthValidationError) {
      return { success: false, affectedRows: 0, error: error.message };
    }

    return {
      success: false,
      affectedRows: 0,
      error: "Erro ao atualizar nome do usuário",
    };
  }
}

async function updateUserEmail(params: {
  userId: string;
  email: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.userId, "userId");

    if (!params.email || typeof params.email !== "string") {
      throw new AuthValidationError(
        "email é obrigatório e deve ser uma string",
        "email",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email.trim())) {
      throw new AuthValidationError("email inválido", "email");
    }

    const query = `
      UPDATE ${AUTH_TABLES.USER}
      SET email = ?
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [
      params.email.trim(),
      params.userId,
    ]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error: result.affectedRows === 0 ? "Usuário não encontrado" : null,
    };
  } catch (error) {
    console.error(`[UserAuthService] Erro em updateUserEmail:`, error);

    if (error instanceof AuthValidationError) {
      return { success: false, affectedRows: 0, error: error.message };
    }

    return {
      success: false,
      affectedRows: 0,
      error: "Erro ao atualizar email do usuário",
    };
  }
}

async function updateUserRole(params: {
  userId: string;
  role: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.userId, "userId");

    const validRoles = ["user", "admin"];
    if (
      !params.role ||
      typeof params.role !== "string" ||
      !validRoles.includes(params.role)
    ) {
      throw new AuthValidationError("role deve ser 'user' ou 'admin'", "role");
    }

    const query = `
      UPDATE ${AUTH_TABLES.USER}
      SET role = ?
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [
      params.role,
      params.userId,
    ]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error: result.affectedRows === 0 ? "Usuário não encontrado" : null,
    };
  } catch (error) {
    console.error(`[UserAuthService] Erro em updateUserRole:`, error);

    if (error instanceof AuthValidationError) {
      return { success: false, affectedRows: 0, error: error.message };
    }

    return {
      success: false,
      affectedRows: 0,
      error: "Erro ao atualizar função do usuário",
    };
  }
}

async function updateUserAppId(params: {
  userId: string;
  appId: number;
}): Promise<ModifyResponse> {
  try {
    validateId(params.userId, "userId");

    if (params.appId === undefined || typeof params.appId !== "number") {
      throw new AuthValidationError(
        "appId é obrigatório e deve ser um número",
        "appId",
      );
    }

    const query = `
      UPDATE ${AUTH_TABLES.USER}
      SET appId = ?
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [
      params.appId,
      params.userId,
    ]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error: result.affectedRows === 0 ? "Usuário não encontrado" : null,
    };
  } catch (error) {
    console.error(`[UserAuthService] Erro em updateUserAppId:`, error);

    if (error instanceof AuthValidationError) {
      return { success: false, affectedRows: 0, error: error.message };
    }

    return {
      success: false,
      affectedRows: 0,
      error: "Erro ao atualizar appId do usuário",
    };
  }
}

function escapeLikePattern(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

async function findUsersWithOrganizations(params: {
  searchTerm?: string;
}): Promise<ServiceResponse<TblUserFindWithOrg[]>> {
  try {
    const hasSearch = !!(
      params.searchTerm && params.searchTerm.trim().length > 0
    );
    const trimmedTerm = hasSearch ? (params.searchTerm?.trim() ?? null) : null;
    const escapedTerm = trimmedTerm ? escapeLikePattern(trimmedTerm) : null;
    const searchPattern = escapedTerm ? `%${escapedTerm}%` : null;
    const isEmailSearch =
      !!trimmedTerm && trimmedTerm.includes("@") && trimmedTerm.includes(".");

    const { query, queryParams } = UserFindWithOrgQuery({
      hasSearch,
      searchPattern,
      exactEmail: isEmailSearch ? trimmedTerm : null,
    });

    const results = await dbService.selectExecute<TblUserFindWithOrg>(
      query,
      queryParams,
    );

    return {
      success: true,
      data: results,
      error: null,
    };
  } catch (error) {
    return handleError<TblUserFindWithOrg[]>(
      error,
      "findUsersWithOrganizations",
    );
  }
}

export const UserAuthService = {
  findUserById,
  findUsersExcludingIds,
  findNonMemberUsers,
  findUsersWithoutAnyOrganization,
  updateUserName,
  updateUserEmail,
  updateUserRole,
  updateUserAppId,
  findUsersWithOrganizations,
} as const;

export type { ServiceResponse, User } from "@/database/shared/auth/auth.types";
