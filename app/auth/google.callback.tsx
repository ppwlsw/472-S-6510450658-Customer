import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

export async function loader({request, params}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/login?error=Google authentication failed");
}

try {
    const tokens = await getGoogleTokens(code, request.url);
    const userInfo = await getGoogleUserInfo(tokens.accessToken);
    console.log(
      userInfo
    );
    return userInfo;
} catch (error) {
    return redirect("/login?error=Authentication failed");
}
}

interface GoogleTokensResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

async function getGoogleTokens(code: string, redirectUri: string) {
  const callback_url = redirectUri.split("?")[0];
  const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
          redirect_uri: callback_url,
          grant_type: "authorization_code",
      }),
  });

  const data = await response.json() as GoogleTokensResponse;
  return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
  };
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
          Authorization: `Bearer ${accessToken}`,
      },
  });

  return response.json();
}