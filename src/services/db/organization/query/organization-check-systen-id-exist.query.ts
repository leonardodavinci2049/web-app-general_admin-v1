import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationCheckSystemIdExistDto } from "../dto/organization-check-systen-id-exist.dto";

export async function OrganizationCheckSystenIdExistQuery(
  dataJsonDto: OrganizationCheckSystemIdExistDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_TERM = dataJsonDto.PE_TERM;

  const queryString = ` call sp_organization_check_systen_id_exist_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        ${PE_TERM}
        ) `;

  return queryString;
}
