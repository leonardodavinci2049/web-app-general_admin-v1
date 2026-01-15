import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationUpdSystemIdDto } from "../dto/organization-upd-system-id.dto";

export async function OrganizationUpdSystemIdQuery(
  dataJsonDto: OrganizationUpdSystemIdDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_SYSTEM_ID = dataJsonDto.PE_SYSTEM_ID;

  const queryString = ` call sp_organization_upd_system_id_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}',
        ${PE_SYSTEM_ID}
        ) `;

  return queryString;
}
