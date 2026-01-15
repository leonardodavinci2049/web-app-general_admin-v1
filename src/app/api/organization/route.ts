import { type NextRequest, NextResponse } from "next/server";
import organizationService from "@/services/db/organization/organization.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      PE_ORGANIZATION_ID: searchParams.get("PE_ORGANIZATION_ID") ?? undefined,
      PE_ORGANIZATION: searchParams.get("PE_ORGANIZATION") ?? undefined,
      PE_LIMIT: searchParams.has("PE_LIMIT")
        ? Number(searchParams.get("PE_LIMIT"))
        : undefined,
    };

    const result =
      await organizationService.execOrganizationSelAllQuery(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await organizationService.execOrganizationSelIdQuery(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
