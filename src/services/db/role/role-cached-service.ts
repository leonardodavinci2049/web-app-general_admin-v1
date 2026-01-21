import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { MemberRole } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache-config";
import roleService from "./role.service";
import type { TblRoleFindAll } from "./types/role.type";

const logger = createLogger("RoleCachedService");

export type MemberRoleListItem = MemberRole;

function transformMemberRole(role: TblRoleFindAll): MemberRole {
  return {
    id: role.id,
    role: role.role,
    name: role.name,
  };
}

export async function getAllMemberRoles(
  organizationId?: string,
  userId?: string,
  limit?: number,
): Promise<MemberRoleListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.memberRoles);

  try {
    const response = await roleService.execMemberRoleFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading member roles:", response.message);
      return [];
    }

    const rawRoles = Array.isArray(response.data) ? response.data : [];

    return rawRoles.map(transformMemberRole);
  } catch (error) {
    logger.error("Failed to fetch member roles:", error);
    return [];
  }
}
