import { envs } from "@/core/config";
import type { OrganizationSelActiveDto } from "../dto/organization-sel-active.dto";

export function OrganizationSelActiveQuery(
  _dataJsonDto: OrganizationSelActiveDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = envs.USER_ID;

  const queryString = ` call sp_organization_sel_active_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}'
        ) `;

  return queryString;
}
