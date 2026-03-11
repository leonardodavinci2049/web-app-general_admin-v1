import { envs } from "@/core/config";
import type { OrganizationUpdSlugDto } from "../dto/organization-upd-slug.dto";

export function OrganizationUpdSlugQuery(
  dataJsonDto: OrganizationUpdSlugDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_ORGANIZATION_SLUG = dataJsonDto.PE_ORGANIZATION_SLUG;

  const queryString = ` call sp_organization_upd_slug_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}',
        '${PE_ORGANIZATION_SLUG}'
        ) `;

  return queryString;
}
