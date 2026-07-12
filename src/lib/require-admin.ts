import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isSessionTokenValid } from "./admin-auth";

// Defense-in-depth check for use inside /api/admin/* Route Handlers — proxy.ts
// already gates these routes, but each handler re-verifies independently
// rather than relying solely on proxy (see Next.js proxy.js docs).
export async function requireAdminSession(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const authed = isSessionTokenValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!authed) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  return null;
}

// Same defense-in-depth idea, for Server Components under /admin — proxy.ts
// already redirects unauthenticated requests before rendering ever starts,
// this is a second, independent check.
export async function requireAdminPage(): Promise<void> {
  const cookieStore = await cookies();
  const authed = isSessionTokenValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!authed) redirect("/admin/login");
}
