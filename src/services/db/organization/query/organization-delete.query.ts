import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationDeleteDto } from "../dto/organization-delete.dto";

export async function OrganizationDeleteQuery(
  dataJsonDto: OrganizationDeleteDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;

  const queryString = ` call sp_organization_delete_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}'
        ) `;

  return queryString;
}
