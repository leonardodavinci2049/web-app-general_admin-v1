import { AUTH_TABLES } from "@/database/shared/auth/auth.types";

interface UserFindWithOrgParams {
  hasSearch: boolean;
  exactEmail: string | null;
  searchPattern: string | null;
}

export function UserFindWithOrgQuery(params: UserFindWithOrgParams): {
  query: string;
  queryParams: string[] | undefined;
} {
  let whereClause = "";
  const queryParams: string[] = [];

  if (params.hasSearch) {
    if (params.exactEmail) {
      whereClause = "WHERE u.email = ?";
      queryParams.push(params.exactEmail);
    } else if (params.searchPattern) {
      whereClause = `
        WHERE
          u.name LIKE ? ESCAPE '\\\\'
          OR u.email LIKE ? ESCAPE '\\\\'
          OR o.name LIKE ? ESCAPE '\\\\'
      `;
      queryParams.push(
        params.searchPattern,
        params.searchPattern,
        params.searchPattern,
      );
    }
  }

  const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.emailVerified,
      u.image,
      u.createdAt,
      u.updatedAt,
      u.twoFactorEnabled,
      u.banned,
      u.banReason,
      u.banExpires,
      u.role,
      m.organizationId,
      m.role AS memberRole,
      o.name AS organizationName
    FROM ${AUTH_TABLES.USER} u
    LEFT JOIN ${AUTH_TABLES.MEMBER} m ON m.userId = u.id
    LEFT JOIN ${AUTH_TABLES.ORGANIZATION} o ON o.id = m.organizationId
    ${whereClause}
    ORDER BY u.createdAt DESC
    LIMIT 100
  `;

  return {
    query,
    queryParams: queryParams.length > 0 ? queryParams : undefined,
  };
}
