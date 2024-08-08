import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// protected route handler
export async function GET() {
  // retrieve user's role from the session object
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    // return OK response if requesting user is an admin
    return new Response(JSON.stringify({ success: "Authorized" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      statusText: "Authorized",
    });
  } else {
    // return !OK response if requesting user is NOT an admin
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
      statusText: "Unauthorized",
    });
  }
}
