import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import type { LogLogin, LogOperation } from "@/services/db/schema";
import logService from "./log.service";
import type {
  TblLogLoginFindAll,
  TblLoglogOperationFindAll,
} from "./types/log.type";

const logger = createLogger("LogCachedService");

export type LogLoginListItem = LogLogin;
export type LogOperationListItem = LogOperation;

function transformLogLogin(log: TblLogLoginFindAll): LogLogin {
  return {
    logId: log.log_id,
    appId: log.app_id,
    organizationId: log.organization_Id,
    userId: log.user_id,
    userName: log.user_name,
    moduleId: log.module_id,
    recordId: log.record_id,
    log: log.log,
    note: log.note,
    createdAt: log.createdAt,
  };
}

function transformLogOperation(log: TblLoglogOperationFindAll): LogOperation {
  return {
    logId: log.log_id,
    appId: log.app_id,
    appName: log.app_name,
    organizationId: log.organization_Id,
    organizationName: log.organization_name,
    userId: log.user_id,
    userName: log.user_name,
    moduleId: log.module_id,
    recordId: log.record_id,
    log: log.log,
    note: log.note,
    createdAt: log.createdAt,
  };
}

export async function getAllLoginLogs(
  organizationId?: string,
  userId?: string,
  searchTerm?: string,
  limit?: number,
): Promise<LogLoginListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.logLogins);

  try {
    const response = await logService.execLogLoginFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_USER: searchTerm,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading login logs:", response.message);
      return [];
    }

    const rawLogs = Array.isArray(response.data) ? response.data : [];

    return rawLogs.map(transformLogLogin);
  } catch (error) {
    logger.error("Failed to fetch login logs:", error);
    return [];
  }
}

export async function getAllOperationLogs(
  organizationId?: string,
  userId?: string,
  searchTerm?: string,
  limit?: number,
): Promise<LogOperationListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.logOperations);

  try {
    const response = await logService.execLogOperationFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_USER: searchTerm,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading operation logs:", response.message);
      return [];
    }

    const rawLogs = Array.isArray(response.data) ? response.data : [];

    return rawLogs.map(transformLogOperation);
  } catch (error) {
    logger.error("Failed to fetch operation logs:", error);
    return [];
  }
}
