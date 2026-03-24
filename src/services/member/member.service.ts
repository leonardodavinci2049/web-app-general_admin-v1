import { z } from "zod";
import { MESSAGES } from "@/core/constants/globalConstants";

import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/database/dbConnection";
import {
  AUTH_TABLES,
  AuthValidationError,
  type Member,
  type MemberEntity,
  type MemberWithUser,
  type MemberWithUserEntity,
  type ModifyResponse,
  mapMemberEntityToDto,
  mapMemberWithUserEntityToDto,
  type ServiceResponse,
} from "@/database/shared/auth/auth.types";
import { processProcedureResultMutation } from "@/database/utils/process-procedure-result.mutation";
import { processProcedureResultQueryWithoutId } from "@/database/utils/process-procedure-result.query";
import { ResultModel } from "@/database/utils/result.model";
import { validateMemberFindAllDto } from "./dto/member-find-all.dto";
import { validateMemberNotFindAllDto } from "./dto/member-not-find-all.dto";
import { validateMemberRoleFindAllDto } from "./dto/member-role-find-all.dto";
import { validateMemberUpdPersonIdDto } from "./dto/member-upd-person-id.dto";
import { MemberRoleFindAllQuery } from "./query/member_role_find_all.query";
import { MemberFindAllQuery } from "./query/member-find-all.query";
import { MemberNotFindAllQuery } from "./query/member-not-find-all.query";
import { MemberUpdPersonIdQuery } from "./query/member-upd-person-id.query";
import type {
  SpResultRecordMemberFindAllType,
  SpResultRecordMemberNotFindAllType,
  SpResultRecordMemberRoleFindAllType,
  SpResultRecordMemberUpdateType,
  TblMemberFindAll,
  TblMemberNotFindAll,
  TblMemberRoleFindAll,
} from "./types/member.type";

export class MemberService {
  async execMemberRoleFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberRoleFindAllDto(dataJsonDto);

      const queryString = await MemberRoleFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberRoleFindAllType;

      return processProcedureResultQueryWithoutId<TblMemberRoleFindAll>(
        resultData as unknown[],
        "Member roles not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execMemberFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberFindAllDto(dataJsonDto);

      const queryString = await MemberFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberFindAllType;

      return processProcedureResultQueryWithoutId<TblMemberFindAll>(
        resultData as unknown[],
        "Member not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execMemberNotFindAllQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberNotFindAllDto(dataJsonDto);

      const queryString = await MemberNotFindAllQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberNotFindAllType;

      return processProcedureResultQueryWithoutId<TblMemberNotFindAll>(
        resultData as unknown[],
        "Member not found",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }

  async execMemberUpdPersonIdQuery(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      const validatedDto = validateMemberUpdPersonIdDto(dataJsonDto);

      const queryString = await MemberUpdPersonIdQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordMemberUpdateType;

      return processProcedureResultMutation(
        resultData as unknown[],
        "Member person ID update failed",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, "", []);
    }
  }
}

const memberService = new MemberService();
export default memberService;

// ============================================================================
// Auth Member Methods (migrated from auth.service.ts)
// ============================================================================

const IdSchema = z
  .string()
  .min(1, "ID é obrigatório")
  .max(128, "ID muito longo");

function validateId(id: string, fieldName: string): void {
  const result = IdSchema.safeParse(id);
  if (!result.success) {
    throw new AuthValidationError(
      `${fieldName}: ${result.error.issues[0].message}`,
      fieldName,
    );
  }
}

function handleError<T>(error: unknown, operation: string): ServiceResponse<T> {
  console.error(`[MemberAuthService] Erro em ${operation}:`, error);

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

function handleModifyError(error: unknown, operation: string): ModifyResponse {
  console.error(`[MemberAuthService] Erro em ${operation}:`, error);

  if (error instanceof AuthValidationError) {
    return { success: false, affectedRows: 0, error: error.message };
  }

  return {
    success: false,
    affectedRows: 0,
    error: "Erro ao realizar operação de modificação",
  };
}

async function findMembersByOrganization(params: {
  organizationId: string;
}): Promise<ServiceResponse<Member[]>> {
  try {
    validateId(params.organizationId, "organizationId");

    const query = `
      SELECT 
        id, organizationId, userId, role, personId, createdAt, updatedAt
      FROM ${AUTH_TABLES.MEMBER}
      WHERE organizationId = ?
      ORDER BY createdAt ASC
    `;

    const results = await dbService.selectExecute<MemberEntity>(query, [
      params.organizationId,
    ]);

    return {
      success: true,
      data: results.map(mapMemberEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Member[]>(error, "findMembersByOrganization");
  }
}

async function findFirstMemberByUser(params: {
  userId: string;
}): Promise<ServiceResponse<Member | null>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id, organizationId, userId, role, personId, createdAt, updatedAt
      FROM ${AUTH_TABLES.MEMBER}
      WHERE userId = ?
      ORDER BY createdAt ASC
      LIMIT 1
    `;

    const results = await dbService.selectExecute<MemberEntity>(query, [
      params.userId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapMemberEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<Member | null>(error, "findFirstMemberByUser");
  }
}

async function findMembersByUser(params: {
  userId: string;
}): Promise<ServiceResponse<Member[]>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id, organizationId, userId, role, personId, createdAt, updatedAt
      FROM ${AUTH_TABLES.MEMBER}
      WHERE userId = ?
      ORDER BY createdAt ASC
    `;

    const results = await dbService.selectExecute<MemberEntity>(query, [
      params.userId,
    ]);

    return {
      success: true,
      data: results.map(mapMemberEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<Member[]>(error, "findMembersByUser");
  }
}

async function deleteMember(params: {
  memberId: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.memberId, "memberId");

    const query = `
      DELETE FROM ${AUTH_TABLES.MEMBER}
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [params.memberId]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error:
        result.affectedRows === 0
          ? "Membro não encontrado ou já deletado"
          : null,
    };
  } catch (error) {
    return handleModifyError(error, "deleteMember");
  }
}

async function findMembersWithUsersByOrganization(params: {
  organizationId: string;
}): Promise<ServiceResponse<MemberWithUser[]>> {
  try {
    validateId(params.organizationId, "organizationId");

    const query = `
      SELECT 
        m.id, m.organizationId, m.userId, m.role, m.personId, m.createdAt, m.updatedAt,
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

    const results = await dbService.selectExecute<MemberWithUserEntity>(query, [
      params.organizationId,
    ]);

    return {
      success: true,
      data: results.map(mapMemberWithUserEntityToDto),
      error: null,
    };
  } catch (error) {
    return handleError<MemberWithUser[]>(
      error,
      "findMembersWithUsersByOrganization",
    );
  }
}

async function updateMemberPersonId(params: {
  memberId: string;
  personId: number;
}): Promise<ModifyResponse> {
  try {
    validateId(params.memberId, "memberId");

    if (!Number.isInteger(params.personId) || params.personId <= 0) {
      throw new AuthValidationError(
        "personId deve ser um inteiro positivo",
        "personId",
      );
    }

    const query = `
      UPDATE ${AUTH_TABLES.MEMBER}
      SET personId = ?
      WHERE id = ?
    `;

    const result = await dbService.modifyExecute(query, [
      params.personId,
      params.memberId,
    ]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error: result.affectedRows === 0 ? "Membro não encontrado" : null,
    };
  } catch (error) {
    return handleModifyError(error, "updateMemberPersonId");
  }
}

export const MemberAuthService = {
  findMembersByOrganization,
  findFirstMemberByUser,
  findMembersByUser,
  deleteMember,
  findMembersWithUsersByOrganization,
  updateMemberPersonId,
} as const;

export type {
  Member,
  MemberWithUser,
  ModifyResponse,
  ServiceResponse,
} from "@/database/shared/auth/auth.types";
