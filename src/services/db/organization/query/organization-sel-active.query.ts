import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationSelActiveDto } from "../dto/organization-sel-active.dto";

export async function OrganizationSelActiveQuery(
  _dataJsonDto: OrganizationSelActiveDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;

  const queryString = ` call sp_organization_sel_active_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}'
        ) `;

  return queryString;
}
