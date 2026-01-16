import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationFindAllDto } from "../dto/organization-find-all.dto";

export async function OrganizationFindAllQuery(
  dataJsonDto: OrganizationFindAllDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_ORGANIZATION = dataJsonDto.PE_ORGANIZATION;
  const PE_LIMIT = dataJsonDto.PE_LIMIT;

  const queryString = ` call sp_organization_find_all_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        ${PE_ORGANIZATION_ID ? `'${PE_ORGANIZATION_ID}'` : "NULL"},
        ${PE_ORGANIZATION ? `'${PE_ORGANIZATION}'` : "NULL"},
        ${PE_LIMIT ?? 0}
        ) `;

  return queryString;
}
