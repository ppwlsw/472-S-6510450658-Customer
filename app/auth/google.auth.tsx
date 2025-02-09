import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({request}: LoaderFunctionArgs) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: process.env.GOOGLE_CALLBACK as string,
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "consent"
  });
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}