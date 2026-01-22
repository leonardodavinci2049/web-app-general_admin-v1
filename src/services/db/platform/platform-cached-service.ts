import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import type { TblApp } from "@/services/db/schema";
import platformService from "./platform.service";
import type { TblPlatformAppFindAll } from "./types/platform.type";

const logger = createLogger("PlatformCachedService");

export type PlatformAppListItem = TblApp;

function transformPlatformApp(platformApp: TblPlatformAppFindAll): TblApp {
  return {
    id: platformApp.id,
    name: platformApp.name,
    description: null,
    createdAt: null,
    updatedAt: null,
  };
}

export async function getAllPlatformApps(
  organizationId?: string,
  userId?: string,
  searchTerm?: string,
  limit?: number,
): Promise<PlatformAppListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.platformAppFindAll);

  try {
    const response = await platformService.execPlatformAppFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_APP: searchTerm,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading platform apps:", response.message);
      return [];
    }

    const rawPlatformApps = Array.isArray(response.data) ? response.data : [];

    return rawPlatformApps.map(transformPlatformApp);
  } catch (error) {
    logger.error("Failed to fetch platform apps:", error);
    return [];
  }
}
