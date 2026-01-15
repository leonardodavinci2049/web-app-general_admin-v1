import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationCheckNameExistDto } from "../dto/organization-check-name-exist.dto";

export async function OrganizationCheckNameExistQuery(
  dataJsonDto: OrganizationCheckNameExistDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_TERM = dataJsonDto.PE_TERM;

  const queryString = ` call sp_organization_check_name_exist_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        '${PE_TERM}'
        ) `;

  return queryString;
}
