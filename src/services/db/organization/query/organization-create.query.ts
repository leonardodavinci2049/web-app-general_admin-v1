import { envs } from "@/core/config";
import { getUserId } from "@/lib/auth/get-user-id";
import type { OrganizationCreateDto } from "../dto/organization-create.dto";

export async function OrganizationCreateQuery(
  dataJsonDto: OrganizationCreateDto,
): Promise<string> {
  const userId = await getUserId();

  const PE_APP_ID = envs.APP_ID;
  const PE_USER_ID = userId;
  const PE_SYSTEM_ID = dataJsonDto.PE_SYSTEM_ID;
  const PE_ORGANIZATION_ID = dataJsonDto.PE_ORGANIZATION_ID;
  const PE_ORGANIZATION_NAME = dataJsonDto.PE_ORGANIZATION_NAME;
  const PE_ORGANIZATION_SLUG = dataJsonDto.PE_ORGANIZATION_SLUG;

  const queryString = ` call sp_organization_create_v1(
        ${PE_APP_ID},
        '${PE_USER_ID}',
        ${PE_SYSTEM_ID},
        '${PE_ORGANIZATION_ID}',
        '${PE_ORGANIZATION_NAME}',
        '${PE_ORGANIZATION_SLUG}'
        ) `;

  return queryString;
}
