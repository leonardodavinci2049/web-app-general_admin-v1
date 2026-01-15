import { envs } from "@/core/config";
import type { OrganizationDeleteDto } from "../dto/organization-delete.dto";

export function OrganizationDeleteQuery(
  dataJsonDto: OrganizationDeleteDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;

  const queryString = ` call sp_organization_delete_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}'
        ) `;

  return queryString;
}
