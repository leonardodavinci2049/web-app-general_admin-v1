import { envs } from "@/core/config";
import type { OrganizationUpdNameDto } from "../dto/organization-upd-name.dto";

export function OrganizationUpdNameQuery(
  dataJsonDto: OrganizationUpdNameDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = envs.USER_ID;
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
