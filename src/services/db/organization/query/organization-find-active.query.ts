import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationFindActiveDto } from "../dto/organization-find-active.dto";

export async function OrganizationFindActiveQuery(
  _dataJsonDto: OrganizationFindActiveDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_LIMIT = _dataJsonDto.PE_LIMIT;

  const queryString = ` call sp_organization_find_active_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        ${PE_LIMIT ?? 0}
        ) `;

  return queryString;
}
