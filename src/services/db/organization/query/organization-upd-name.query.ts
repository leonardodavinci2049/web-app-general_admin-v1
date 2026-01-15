import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationUpdNameDto } from "../dto/organization-upd-name.dto";

export async function OrganizationUpdNameQuery(
  dataJsonDto: OrganizationUpdNameDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_ORGANIZATION_NAME = dataJsonDto.PE_ORGANIZATION_NAME;

  const queryString = ` call sp_organization_upd_name_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}',
        '${PE_ORGANIZATION_NAME}'
        ) `;

  return queryString;
}
