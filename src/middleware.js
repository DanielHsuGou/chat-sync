import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export function middleware(req) {
  const apiKey = req.headers.get("x-api-key");
  console.log("API Key from Request:", apiKey); // Log to verify
  console.log("API Key from Environment:", process.env.NEXT_PUBLIC_API_KEY); // Log to verify

  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return new NextResponse(
      JSON.stringify({ message: "Forbidden: Invalid API Key" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
}

export default withAuth(
  async function (req) {
    const response = middleware(req);
    if (response.status !== 200) {
      return response;
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/api/servers/:path*",
    "/api/serverChannels/:path*",
    "/api/users/:path*",
    "/api/user/:path*", // Ensure this is correctly configured
    "/api/userss/:path*",
  ],
};
