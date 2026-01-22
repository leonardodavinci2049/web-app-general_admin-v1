import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import type { TblMemberRole } from "@/services/db/schema";
import memberService from "./member.service";
import type { TblMemberRoleFindAll } from "./types/member.type";

const logger = createLogger("MemberCachedService");

export type MemberRoleListItem = TblMemberRole;

function transformMemberRole(role: TblMemberRoleFindAll): TblMemberRole {
  return {
    id: role.id,
    uuid: role.uuid,
    role: role.role,
    name: role.name,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
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
