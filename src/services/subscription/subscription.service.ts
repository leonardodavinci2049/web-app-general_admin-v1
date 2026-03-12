import "server-only";

import { z } from "zod";
import dbService, {
  ErroConexaoBancoDados,
  ErroExecucaoConsulta,
} from "@/database/dbConnection";

import {
  AUTH_TABLES,
  AuthValidationError,
  type ModifyResponse,
  mapSubscriptionEntityToDto,
  type ServiceResponse,
  type Subscription,
  type SubscriptionEntity,
} from "@/database/shared/auth/auth.types";

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
  console.error(`[SubscriptionService] Erro em ${operation}:`, error);

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
  console.error(`[SubscriptionService] Erro em ${operation}:`, error);

  if (error instanceof AuthValidationError) {
    return { success: false, affectedRows: 0, error: error.message };
  }

  return {
    success: false,
    affectedRows: 0,
    error: "Erro ao realizar operação de modificação",
  };
}

async function createSubscription(params: {
  userId: string;
  plan: string;
  status: string;
  approvedAt?: Date;
}): Promise<ServiceResponse<Subscription>> {
  try {
    validateId(params.userId, "userId");

    if (!params.plan || params.plan.trim().length === 0) {
      throw new AuthValidationError("Plan é obrigatório", "plan");
    }

    if (!params.status || params.status.trim().length === 0) {
      throw new AuthValidationError("Status é obrigatório", "status");
    }

    const id = `sub_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const now = new Date();

    const query = `
      INSERT INTO ${AUTH_TABLES.SUBSCRIPTION}
        (id, userId, plan, status, approvedAt, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await dbService.ModifyExecute(query, [
      id,
      params.userId,
      params.plan,
      params.status,
      params.approvedAt || null,
      now,
    ]);

    return {
      success: true,
      data: {
        id,
        userId: params.userId,
        plan: params.plan,
        status: params.status,
        approvedAt: params.approvedAt || null,
        createdAt: now,
      },
      error: null,
    };
  } catch (error) {
    return handleError<Subscription>(error, "createSubscription");
  }
}

async function findSubscriptionByUserId(params: {
  userId: string;
}): Promise<ServiceResponse<Subscription | null>> {
  try {
    validateId(params.userId, "userId");

    const query = `
      SELECT 
        id, userId, plan, status, approvedAt, createdAt
      FROM ${AUTH_TABLES.SUBSCRIPTION}
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    const results = await dbService.selectExecute<SubscriptionEntity>(query, [
      params.userId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapSubscriptionEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<Subscription | null>(error, "findSubscriptionByUserId");
  }
}

async function findSubscriptionById(params: {
  subscriptionId: string;
}): Promise<ServiceResponse<Subscription | null>> {
  try {
    validateId(params.subscriptionId, "subscriptionId");

    const query = `
      SELECT 
        id, userId, plan, status, approvedAt, createdAt
      FROM ${AUTH_TABLES.SUBSCRIPTION}
      WHERE id = ?
      LIMIT 1
    `;

    const results = await dbService.selectExecute<SubscriptionEntity>(query, [
      params.subscriptionId,
    ]);

    if (results.length === 0) {
      return { success: true, data: null, error: null };
    }

    return {
      success: true,
      data: mapSubscriptionEntityToDto(results[0]),
      error: null,
    };
  } catch (error) {
    return handleError<Subscription | null>(error, "findSubscriptionById");
  }
}

async function updateSubscription(params: {
  subscriptionId: string;
  plan?: string;
  status?: string;
  approvedAt?: Date | null;
}): Promise<ModifyResponse> {
  try {
    validateId(params.subscriptionId, "subscriptionId");

    const updates: string[] = [];
    const values: (string | Date | null)[] = [];

    if (params.plan !== undefined) {
      if (params.plan.trim().length === 0) {
        throw new AuthValidationError("Plan não pode ser vazio", "plan");
      }
      updates.push("plan = ?");
      values.push(params.plan);
    }

    if (params.status !== undefined) {
      if (params.status.trim().length === 0) {
        throw new AuthValidationError("Status não pode ser vazio", "status");
      }
      updates.push("status = ?");
      values.push(params.status);
    }

    if (params.approvedAt !== undefined) {
      updates.push("approvedAt = ?");
      values.push(params.approvedAt);
    }

    if (updates.length === 0) {
      return {
        success: false,
        affectedRows: 0,
        error: "Nenhum campo para atualizar",
      };
    }

    values.push(params.subscriptionId);

    const query = `
      UPDATE ${AUTH_TABLES.SUBSCRIPTION}
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    const result = await dbService.ModifyExecute(query, values);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error:
        result.affectedRows === 0
          ? "Subscription não encontrada ou já atualizada"
          : null,
    };
  } catch (error) {
    return handleModifyError(error, "updateSubscription");
  }
}

async function deleteSubscription(params: {
  subscriptionId: string;
}): Promise<ModifyResponse> {
  try {
    validateId(params.subscriptionId, "subscriptionId");

    const query = `
      DELETE FROM ${AUTH_TABLES.SUBSCRIPTION}
      WHERE id = ?
    `;

    const result = await dbService.ModifyExecute(query, [
      params.subscriptionId,
    ]);

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows,
      error:
        result.affectedRows === 0
          ? "Subscription não encontrada ou já deletada"
          : null,
    };
  } catch (error) {
    return handleModifyError(error, "deleteSubscription");
  }
}

export const SubscriptionService = {
  createSubscription,
  findSubscriptionByUserId,
  findSubscriptionById,
  updateSubscription,
  deleteSubscription,
} as const;

export default SubscriptionService;

export type {
  ModifyResponse,
  ServiceResponse,
  Subscription,
} from "@/database/shared/auth/auth.types";
