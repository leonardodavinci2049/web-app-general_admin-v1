import { envs } from "@/core/config";
import type { LogOperationFindAllDto } from "../dto/log_operation_find_all.dto";

export function LogOperationFindAllQuery(
  dataJsonDto: LogOperationFindAllDto,
): string {
  const PE_APP_ID = envs.APP_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_USER_ID = dataJsonDto.PE_USER_ID;
  const PE_SEARCH_USER = dataJsonDto.PE_SEARCH_USER;
  const PE_LIMIT = dataJsonDto.PE_LIMIT;

  const queryString = ` call sp_log_operation_find_all_v2(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID || "null"}',
        '${PE_USER_ID || "null"}',
        '${PE_SEARCH_USER || "null"}',
        ${PE_LIMIT || "null"}
        ) `;

  return queryString;
}
