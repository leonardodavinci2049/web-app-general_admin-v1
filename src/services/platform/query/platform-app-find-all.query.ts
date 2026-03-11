import { envs } from "@/core/config";
import type { PlatformAppFindAllDto } from "../dto/platform-app-find-all.dto";

export function PlatformAppFindAllQuery(
  dataJsonDto: PlatformAppFindAllDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID || "";
  const PE_USER_ID = dataJsonDto.PE_USER_ID || "";
  const PE_SEARCH_APP = dataJsonDto.PE_SEARCH_APP || "";
  const PE_LIMIT = dataJsonDto.PE_LIMIT || 20;

  const queryString = ` call sp_app_find_all_v2(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID}',
        '${PE_USER_ID}',
        '${PE_SEARCH_APP}',
        ${PE_LIMIT}
        ) `;

  return queryString;
}
