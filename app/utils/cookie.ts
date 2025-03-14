import { createCookie, type Cookie, type LoaderFunctionArgs } from "react-router";

const ENV: string = process.env.ENV as string;
const API_BASE_URL: string = process.env.API_BASE_URL as string;

export const authCookie: Cookie = createCookie("auth", {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,

  httpOnly: ENV !== "PRODUCTION",
  secure: ENV === "PRODUCTION",
  secrets: [API_BASE_URL]
});

export interface AuthCookieProps {
  token: string;
  user_id: number;
  role: string;
}

export async function getAuthCookie({ request }: { request: Request }): Promise<AuthCookieProps> {
  const cookie: AuthCookieProps = await authCookie.parse(request.headers.get("Cookie"));
  return cookie;
}
