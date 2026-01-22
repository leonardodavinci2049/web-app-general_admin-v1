import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import { CACHE_TAGS } from "@/lib/cache-config";
import type { User } from "@/services/db/schema";
import type { TblUserFindAll, TblUserFindById } from "./types/user.type";
import userService from "./user.service";

const logger = createLogger("UserCachedService");

export type UserListItem = User;
export type UserDetail = User;

function transformUser(user: TblUserFindById | TblUserFindAll): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || null,
    twoFactorEnabled: user.twoFactorEnabled === 1,
    role: user.role,
    banned: user.banned === 1,
    banReason: user.banReason || null,
    banExpires: user.banExpires || null,
    createdAt: user.createdAt,
  };
}

export async function getUserById(userId: string): Promise<UserDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.user(userId), CACHE_TAGS.users);

  try {
    const response = await userService.execUserFindIdQuery({
      PE_USER_ID: userId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.warn(`User not found: ${userId}`);
      return null;
    }

    const rawUser = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return transformUser(rawUser);
  } catch (error) {
    logger.error(`Failed to fetch user by ID ${userId}:`, error);
    return null;
  }
}

export async function getAllUsers(
  organizationId?: string,
  searchTerm?: string,
  flagMemberOff?: number,
  qtRegistros?: number,
  paginaId?: number,
  colunaId?: number,
  ordemId?: number,
): Promise<UserListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.users);

  try {
    const response = await userService.execUserFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_SEARCH_USER: searchTerm,
      PE_FLAG_MEMBER_OFF: flagMemberOff,
      PE_QT_REGISTROS: qtRegistros,
      PE_PAGINA_ID: paginaId,
      PE_COLUNA_ID: colunaId,
      PE_ORDEM_ID: ordemId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading users:", response.message);
      return [];
    }

    const rawUsers = Array.isArray(response.data) ? response.data : [];

    return rawUsers.map(transformUser);
  } catch (error) {
    logger.error("Failed to fetch users:", error);
    return [];
  }
}
