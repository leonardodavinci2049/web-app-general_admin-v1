import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationCheckSlugExistDto } from "../dto/organization-check-slug-exist.dto";

export async function OrganizationCheckSlugExistQuery(
  dataJsonDto: OrganizationCheckSlugExistDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_TERM = dataJsonDto.PE_TERM;

  const queryString = ` call sp_organization_check_slug_exist_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_TERM}'
        ) `;

  return queryString;
}
