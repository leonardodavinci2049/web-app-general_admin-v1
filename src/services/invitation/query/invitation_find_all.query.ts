import { envs } from "@/core/config";
import type { InvitationFindAllDto } from "../dto/invitation_find_all.dto";

export function InvitationFindAllQuery(
  dataJsonDto: InvitationFindAllDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID || "";
  const PE_USER_ID = dataJsonDto.PE_USER_ID || "";
  const PE_STATUS = dataJsonDto.PE_STATUS || "";
  const PE_SEARCH_USER = dataJsonDto.PE_SEARCH_USER || "";
  const PE_LIMIT = dataJsonDto.PE_LIMIT || 20;

  const queryString = ` call sp_invitation_find_all_v2(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID}',
        '${PE_USER_ID}',
        '${PE_STATUS}',
        '${PE_SEARCH_USER}',
         ${PE_LIMIT}
        ) `;

  return queryString;
}
