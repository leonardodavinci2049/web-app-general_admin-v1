import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { TblMemberRole } from "@/database/schema";
import type { Member, MemberWithUser } from "@/database/shared/auth/auth.types";
import { CACHE_TAGS } from "@/lib/cache-config";
import memberService, { MemberAuthService } from "./member.service";
import type {
  TblMemberFindAll,
  TblMemberNotFindAll,
  TblMemberRoleFindAll,
} from "./types/member.type";

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

export async function getAllMembers(
  organizationId?: string,
  userId?: string,
  searchUser?: string,
  limit?: number,
): Promise<TblMemberFindAll[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.members);

  try {
    const response = await memberService.execMemberFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_USER: searchUser,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading members:", response.message);
      return [];
    }

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    logger.error("Failed to fetch members:", error);
    return [];
  }
}

export async function getAllNotMembers(
  organizationId?: string,
  userId?: string,
  searchUser?: string,
  limit?: number,
): Promise<TblMemberNotFindAll[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.members);

  try {
    const response = await memberService.execMemberNotFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_SEARCH_USER: searchUser,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading non-members:", response.message);
      return [];
    }

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    logger.error("Failed to fetch non-members:", error);
    return [];
  }
}

export async function getMembersByOrganization(
  organizationId: string,
): Promise<Member[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.member(organizationId), CACHE_TAGS.members);

  try {
    const response = await MemberAuthService.findMembersByOrganization({
      organizationId,
    });

    if (!response.success || !response.data) {
      logger.error("Error loading members by organization:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch members for organization ${organizationId}:`,
      error,
    );
    return [];
  }
}

export async function getMembersWithUsersByOrganization(
  organizationId: string,
): Promise<MemberWithUser[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.member(organizationId), CACHE_TAGS.members);

  try {
    const response = await MemberAuthService.findMembersWithUsersByOrganization(
      {
        organizationId,
      },
    );

    if (!response.success || !response.data) {
      logger.error(
        "Error loading members with users by organization:",
        response.error,
      );
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch members with users for organization ${organizationId}:`,
      error,
    );
    return [];
  }
}

export async function getFirstMemberByUser(
  userId: string,
): Promise<Member | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.members);

  try {
    const response = await MemberAuthService.findFirstMemberByUser({
      userId,
    });

    if (!response.success) {
      logger.error("Error loading first member by user:", response.error);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch first member for user ${userId}:`, error);
    return null;
  }
}

export async function getMembersByUser(userId: string): Promise<Member[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.members);

  try {
    const response = await MemberAuthService.findMembersByUser({ userId });

    if (!response.success || !response.data) {
      logger.error("Error loading members by user:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch members for user ${userId}:`, error);
    return [];
  }
}
