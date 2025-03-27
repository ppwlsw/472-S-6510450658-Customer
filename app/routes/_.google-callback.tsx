import { redirect, type LoaderFunctionArgs } from "react-router";
import { DataCenter } from "~/provider/datacenter";
import { defaultFetcherUserInfo } from "~/repositories/user.repository";
import { authCookie, requestDecryptToken, useAuth } from "~/utils/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/login?error=Google authentication failed");
  }

  const { getGoogleData, loginGoogleApi } = useAuth;
  const googleData = await getGoogleData(code, request.url);
  const data = await loginGoogleApi({
    name: googleData.name,
    email: googleData.email,
    image_url: googleData.picture,
  });

  if (data.error) {
    return redirect(`/login?error=${data.error}`);
  }

  const { token, id, role } = data.data;

  const decrypted = (await requestDecryptToken(token)).data
    .plain_text as string;
  const cookie = await authCookie.serialize({
    token: decrypted,
    user_id: id,
    role: role,
  });

  DataCenter.addData("user_image_info", googleData.picture as string);
  DataCenter.addData("user_name_info", googleData.name as string);
  DataCenter.addData("user_id_info", id as string);

  return redirect("/homepage", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
