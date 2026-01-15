import { type NextRequest, NextResponse } from "next/server";
import organizationService from "@/services/db/organization/organization.service";

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
