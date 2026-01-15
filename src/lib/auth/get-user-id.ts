import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function getUserId(): Promise<string> {
  const reqHeaders = await headers();

  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  return session?.user.id ?? "";
}
