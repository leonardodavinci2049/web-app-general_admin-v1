import { envs } from "@/core/config";
import type { OrganizationCheckNameExistDto } from "../dto/organization-check-name-exist.dto";

export function OrganizationCheckNameExistQuery(
  dataJsonDto: OrganizationCheckNameExistDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_TERM = dataJsonDto.PE_TERM;

  const queryString = ` call sp_organization_check_name_exist_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_TERM}'
        ) `;

  return queryString;
}
