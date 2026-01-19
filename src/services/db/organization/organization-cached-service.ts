import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { Organization } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache-config";
import organizationService from "./organization.service";
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
 */
export async function getOrganizationById(
  id: string,
): Promise<OrganizationDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.organization(id), CACHE_TAGS.organizations);

  try {
    const response = await organizationService.execOrganizationFindByIdQuery({
      id,
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
