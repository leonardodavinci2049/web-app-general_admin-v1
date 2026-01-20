import { envs } from "@/core/config";
import type { OrganizationCheckTermsExistDto } from "../dto/organization-check-terms-exist.dto";

export function OrganizationCheckTermsExistQuery(
  dataJsonDto: OrganizationCheckTermsExistDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_SYSTEM_ID = dataJsonDto.PE_SYSTEM_ID;
  const PE_ORGANIZATION_NAME = dataJsonDto.PE_ORGANIZATION_NAME;
  const PE_ORGANIZATION_SLUG = dataJsonDto.PE_ORGANIZATION_SLUG;

  const queryString = ` call sp_organization_check_terms_exist_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        ${PE_SYSTEM_ID},
        '${PE_ORGANIZATION_NAME}',
        '${PE_ORGANIZATION_SLUG}'
        ) `;

  return queryString;
}
