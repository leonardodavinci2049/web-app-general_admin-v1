import { type NextRequest, NextResponse } from "next/server";
import organizationService from "@/services/db/organization/organization.service";
import type { ResultModel } from "@/services/db/utils/result.model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let result: ResultModel;

    switch (action) {
      case "findById":
        result =
          await organizationService.execOrganizationFindByIdQuery(params);
        break;
      case "findAll":
        result = await organizationService.execOrganizationFindAllQuery(params);
        break;
      case "findActive":
        result =
          await organizationService.execOrganizationFindActiveQuery(params);
        break;
      case "checkTermsExist":
        result =
          await organizationService.execOrganizationCheckTermsExistQuery(
            params,
          );
        break;
      case "checkNameExist":
        result =
          await organizationService.execOrganizationCheckNameExistQuery(params);
        break;
      case "checkSlugExist":
        result =
          await organizationService.execOrganizationCheckSlugExistQuery(params);
        break;
      case "checkSystemIdExist":
        result =
          await organizationService.execOrganizationCheckSystenIdExistQuery(
            params,
          );
        break;
      case "create":
        result = await organizationService.execOrganizationCreateQuery(params);
        break;
      case "updateSlug":
        result =
          await organizationService.execOrganizationUpdateSlugQuery(params);
        break;
      case "updateName":
        result =
          await organizationService.execOrganizationUpdateNameQuery(params);
        break;
      case "updateSystemId":
        result =
          await organizationService.execOrganizationUpdateSystemIdQuery(params);
        break;
      case "delete":
        result = await organizationService.execOrganizationDeleteQuery(params);
        break;

      default:
        result = await organizationService.execOrganizationFindAllQuery(params);
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
