import { envs } from "@/core/config";
import type { OrganizationFindActiveDto } from "../dto/organization-find-active.dto";

export function OrganizationFindActiveQuery(
  dataJsonDto: OrganizationFindActiveDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_LIMIT = dataJsonDto.PE_LIMIT;

  const queryString = ` call sp_organization_find_active_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        ${PE_LIMIT ?? 0}
        ) `;

  return queryString;
}
