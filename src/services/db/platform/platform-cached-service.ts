import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import type { MemberRole } from "@/services/db/schema";
import memberService from "./platform.service";
import type { TblMemberRoleFindAll } from "./types/platform.type";

const logger = createLogger("MemberCachedService");

export type MemberRoleListItem = MemberRole;

function transformMemberRole(role: TblMemberRoleFindAll): MemberRole {
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
    const response = await memberService.execMemberRoleFindAllQuery({
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
