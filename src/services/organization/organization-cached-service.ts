import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { Organization } from "@/database/schema";
import type {
  Organization as AuthOrganization,
  OrganizationWithMembers,
} from "@/database/shared/auth/auth.types";
import { CACHE_TAGS } from "@/lib/cache-config";
import organizationService, {
  OrganizationAuthService,
} from "./organization.service";
import type {
  TblOrganizationFind,
  TblOrganizationFindById,
} from "./types/organization.type";

const logger = createLogger("OrganizationCachedService");

// ============================================================================
// Types
// ============================================================================

export type OrganizationListItem = Organization;
export type OrganizationDetail = Organization;

// ============================================================================
// Transformers
// ============================================================================

/**
 * Transform database organization to schema Organization type
 */
function transformOrganization(
  org: TblOrganizationFind | TblOrganizationFindById,
): Organization {
  return {
    id: org.id,
    system_id: org.system_id,
    name: org.name,
    slug: org.slug,
    logo: org.logo || null,
    createdAt: org.createdAt,
    metadata: org.metadata ? String(org.metadata) : null,
  };
}

// ============================================================================
// Organization Cached Functions
// ============================================================================

/**
 * Fetch all organizations with cache
 * Uses organization service to get data with Next.js 16 cache directives
 *
 * Cache Strategy:
 * - cacheLife("hours"): 1 hour cache duration
 * - cacheTag: organizations tag for granular invalidation
 *
 * @param userId - User ID obtained OUTSIDE of cache scope (from headers/session)
 */
export async function getAllOrganizations(
  userId: string,
  searchTerm?: string,
): Promise<OrganizationListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organizations);

  try {
    const response = await organizationService.execOrganizationFindAllQuery({
      PE_USER_ID: userId,
      PE_ORGANIZATION: searchTerm,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.error("Error loading organizations:", response.message);
      return [];
    }

    // Garantir que response.data seja um array
    const rawOrganizations = Array.isArray(response.data) ? response.data : [];

    return rawOrganizations.map(transformOrganization);
  } catch (error) {
    logger.error("Failed to fetch organizations:", error);
    return [];
  }
}

/**
 * Fetch a single organization by ID with cache
 * Uses organization service with specific organization cache tag
 *
 * Cache Strategy:
 * - cacheLife("hours"): 1 hour cache duration
 * - cacheTag: specific organization tag + general organizations tag for invalidation
 *
 * @param userId - User ID obtained OUTSIDE of cache scope (from headers/session)
 * @param id - Organization ID to fetch
 */
export async function getOrganizationById(
  userId: string,
  id: string,
): Promise<OrganizationDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organization(id), CACHE_TAGS.organizations);

  try {
    const response = await organizationService.execOrganizationFindByIdQuery({
      PE_USER_ID: userId,
      PE_ORGANIZATION_ID: id,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.warn(`Organization not found: ${id}`);
      return null;
    }

    // data pode ser array ou objeto único
    const rawOrganization = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return transformOrganization(rawOrganization);
  } catch (error) {
    logger.error(`Failed to fetch organization by ID ${id}:`, error);
    return null;
  }
}

export async function getActiveOrganization(
  userId: string,
): Promise<Organization | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organizations);

  try {
    const response = await organizationService.execOrganizationFindActiveQuery({
      PE_USER_ID: userId,
    });

    if (response.statusCode !== 100200 || !response.data) {
      logger.warn(`No active organization found for user: ${userId}`);
      return null;
    }

    const rawOrganization = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return transformOrganization(rawOrganization);
  } catch (error) {
    logger.error("Failed to fetch active organization:", error);
    return null;
  }
}

export async function getAuthOrganizationById(
  organizationId: string,
): Promise<AuthOrganization | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organization(organizationId), CACHE_TAGS.organizations);

  try {
    const response = await OrganizationAuthService.findOrganizationById({
      organizationId,
    });

    if (!response.success || !response.data) {
      logger.warn(`Auth organization not found: ${organizationId}`);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch auth organization by ID ${organizationId}:`,
      error,
    );
    return null;
  }
}

export async function getAuthOrganizationsByIds(
  organizationIds: string[],
): Promise<AuthOrganization[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organizations);

  try {
    const response = await OrganizationAuthService.findOrganizationsByIds({
      organizationIds,
    });

    if (!response.success || !response.data) {
      logger.error("Error loading organizations by IDs:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error("Failed to fetch organizations by IDs:", error);
    return [];
  }
}

export async function getUserOrganizations(
  userId: string,
): Promise<AuthOrganization[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organizations);

  try {
    const response = await OrganizationAuthService.findUserOrganizations({
      userId,
    });

    if (!response.success || !response.data) {
      logger.error("Error loading user organizations:", response.error);
      return [];
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch organizations for user ${userId}:`, error);
    return [];
  }
}

export async function getOrganizationBySlugWithMembers(
  slug: string,
): Promise<OrganizationWithMembers | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organizations, CACHE_TAGS.members);

  try {
    const response =
      await OrganizationAuthService.findOrganizationBySlugWithMembers({
        slug,
      });

    if (!response.success || !response.data) {
      logger.warn(`Organization not found by slug: ${slug}`);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch organization by slug ${slug}:`, error);
    return null;
  }
}
