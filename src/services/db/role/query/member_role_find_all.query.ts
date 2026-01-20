import { envs } from "@/core/config";
import type { MemberRoleFindAllDto } from "../dto/member_role_find_all.dto";

export function MemberRoleFindAllQuery(
  dataJsonDto: MemberRoleFindAllDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_LIMIT = dataJsonDto.PE_LIMIT;

  const queryString = ` call sp_member_role_find_all_v2(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID || "null"}',
        '${PE_USER_ID || "null"}',
        ${PE_LIMIT || 20}
        ) `;

  return queryString;
}
