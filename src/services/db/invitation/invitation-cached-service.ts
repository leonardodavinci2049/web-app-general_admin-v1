import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { Invitation } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache-config";
import invitationService from "./invitation.service";
import type { TblInvitationFindAll } from "./types/invitation.type";

const logger = createLogger("InvitationCachedService");

export type InvitationListItem = Invitation;

function transformInvitation(invitation: TblInvitationFindAll): Invitation {
  return {
    id: invitation.id,
    organizationId: invitation.organizationId,
    teamId: invitation.teamId,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    inviterId: invitation.inviterId,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
  };
}

export async function getAllInvitations(
  organizationId?: string,
  userId?: string,
  status?: string,
  searchTerm?: string,
  limit?: number,
): Promise<InvitationListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.invitations);

  try {
    const response = await invitationService.execInvitationFindAllQuery({
      PE_ORGANIZATION_ID: organizationId,
      PE_USER_ID: userId,
      PE_STATUS: status,
      PE_SEARCH_USER: searchTerm,
      PE_LIMIT: limit,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading invitations:", response.message);
      return [];
    }

    const rawInvitations = Array.isArray(response.data) ? response.data : [];

    return rawInvitations.map(transformInvitation);
  } catch (error) {
    logger.error("Failed to fetch invitations:", error);
    return [];
  }
}
