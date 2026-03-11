import { envs } from "@/core/config";
import type { OrganizationFindByIdDto } from "../dto/organization-find-by-id.dto";

export function OrganizationFindByIdQuery(
  dataJsonDto: OrganizationFindByIdDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;

  const queryString = ` call sp_organization_find_by_id_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_ORGANIZATION_ID}'
        ) `;

  return queryString;
}
