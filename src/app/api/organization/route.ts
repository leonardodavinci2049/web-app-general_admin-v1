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
