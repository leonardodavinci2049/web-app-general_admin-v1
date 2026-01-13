import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const { invitationId } = await params;

  try {
    // Verificar se o usuário está autenticado
    await auth.api.getSession({
      headers: await headers(),
    });

    await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
      headers: await headers(),
    });

    // Redirecionar para dashboard com parâmetro de sucesso
    const redirectUrl = new URL("/dashboard", request.url);
    redirectUrl.searchParams.set("invitation", "accepted");
    return NextResponse.redirect(redirectUrl);
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      status?: string;
      statusCode?: number;
    };

    console.error("Error accepting invitation:", {
      invitationId,
      error: err.message,
      status: err.status,
    });

    // Redirecionar baseado no tipo de erro
    const baseUrl = new URL(request.url).origin;

    if (
      err.status === "BAD_REQUEST" &&
      err.message?.includes("Invitation not found")
    ) {
      const errorUrl = new URL("/dashboard", baseUrl);
      errorUrl.searchParams.set("error", "invitation_not_found");
      errorUrl.searchParams.set("invitation_id", invitationId);
      return NextResponse.redirect(errorUrl);
    }

    if (err.statusCode === 401 || err.status === "UNAUTHORIZED") {
      const loginUrl = new URL("/sign-in", baseUrl);
      loginUrl.searchParams.set(
        "callbackUrl",
        `/api/accept-invitation/${invitationId}`,
      );
      loginUrl.searchParams.set(
        "message",
        "Please sign in to accept the invitation",
      );
      return NextResponse.redirect(loginUrl);
    }

    // Erro genérico - redirecionar para dashboard com erro
    const errorUrl = new URL("/dashboard", baseUrl);
    errorUrl.searchParams.set("error", "invitation_error");
    errorUrl.searchParams.set(
      "message",
      err.message || "Failed to accept invitation",
    );
    return NextResponse.redirect(errorUrl);
  }
}
