import { envs } from "@/core/config";
import type { OrganizationCheckSlugExistDto } from "../dto/organization-check-slug-exist.dto";

export function OrganizationCheckSlugExistQuery(
  dataJsonDto: OrganizationCheckSlugExistDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_TERM = dataJsonDto.PE_TERM;

  const queryString = ` call sp_organization_check_slug_exist_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_TERM}'
        ) `;

  return queryString;
}
