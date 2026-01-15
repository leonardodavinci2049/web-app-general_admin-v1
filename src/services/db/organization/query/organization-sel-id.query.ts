import { envs } from "@/core/config";
import type { OrganizationSelIdDto } from "../dto/organization-sel-id.dto";

export function OrganizationSelIdQuery(
  dataJsonDto: OrganizationSelIdDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = envs.USER_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;

  const queryString = ` call sp_organization_sel_id_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}'
        ) `;

  return queryString;
}
