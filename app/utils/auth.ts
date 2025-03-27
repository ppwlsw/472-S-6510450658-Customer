import { createCookie, redirect, type Cookie } from "react-router";

const API_BASE_URL: string = process.env.API_BASE_URL as string;
const ENV: string = process.env.ENV as string;
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL: string = process.env.GOOGLE_CALLBACK_URL as string;

export async function requestGoogleLogin() {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "GET",
  });
  const json = await response.json();
  return redirect(json.data.url as string);
}

interface ResponseMessageProps {
  data: {
    [key: string]: any;
  };
  error: string;
  status: number;
}

interface LoginProps {
  email: string;
  password: string;
}

export async function requestLogin(
  loginProps: LoginProps
): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("email", loginProps.email);
  formData.set("password", loginProps.password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  return {
    status: response.status,
    data: response.status === 201 ? json.data : {},
    error:
      response.status === 201
        ? ""
        : response.status === 404
        ? "ไม่พบข้อมูลหรือยังไม่ได้ยืนยันอีเมล"
        : response.status === 401
        ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        : "เกิดข้อผิดพลาด",
  };
}

interface RegisterProps {
  email: string;
  name: string;
  password: string;
  phone: string;
}

export async function requestRegister(
  registerProps: RegisterProps
): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("email", registerProps.email);
  formData.set("name", registerProps.name);
  formData.set("password", registerProps.password);
  formData.set("phone", registerProps.phone);

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: formData,
  });

  return {
    status: response.status,
    data: {},
    error:
      response.status === 201
        ? ""
        : response.status === 422
        ? "อีเมลนี้ถูกใช้ไปแล้ว"
        : "เกิดข้อผิดพลาด",
  };
}

export async function requestDecryptToken(
  token: string
): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("encrypted", token);
  const response = await fetch(`${API_BASE_URL}/auth/decrypt`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  return {
    data: json.data,
    status: response.status,
    error: response.status === 500 ? "เกิดข้อผิดพลาด" : "",
  };
}

export const authCookie: Cookie = createCookie("auth_customer", {
  path: "/",
  sameSite: "lax",
  maxAge: 60 * 60 * 24,

  httpOnly: ENV !== "PRODUCTION",
  secure: ENV === "PRODUCTION",
  secrets: [API_BASE_URL],
});

interface AuthCookieProps {
  token: string;
  user_id: number;
  role: string;
}

async function getAuthCookie({
  request,
}: {
  request: Request;
}): Promise<AuthCookieProps> {
  const cookie: AuthCookieProps = await authCookie.parse(
    request.headers.get("Cookie")
  );
  return cookie;
}

async function validate({ request }: { request: Request }): Promise<boolean> {
  const isAuthCookieValid = await validateAuthCookie({ request });
  return isAuthCookieValid;
}

async function validateAuthCookie({
  request,
}: {
  request: Request;
}): Promise<boolean> {
  const cookie: AuthCookieProps = await authCookie.parse(
    request.headers.get("Cookie")
  );
  if (!cookie) {
    throw redirect("/login");
  }
  return true;
}

async function logout(token: string): Promise<ResponseMessageProps> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
  });
  return {
    data: {},
    status: response.status,
    error: response.status != 204 ? "เกิดข้อผิดพลาด" : "",
  };
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
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: callback_url,
      grant_type: "authorization_code",
    }),
  });

  const data = (await response.json()) as GoogleTokensResponse;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}

async function getGoogleData(code: string, redirect_url: string) {
  const tokens = await getGoogleTokens(code, redirect_url);
  const userInfo = await getGoogleUserInfo(tokens.accessToken);
  return userInfo;
}

interface LoginGoogleApiProps {
  name: string;
  email: string;
  image_url: string;
}

async function loginGoogleApi({
  name,
  email,
  image_url,
}: LoginGoogleApiProps): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("name", name);
  formData.set("email", email);
  formData.set("image_url", image_url);

  const response = await fetch(`${API_BASE_URL}/auth/google/login`, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();

  return {
    status: response.status,
    data: response.status == 201 ? json.data : {},
    error: response.status != 201 ? "เกิดข้อผิดพลาด" : "",
  };
}

async function googleAuth() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "consent",
  });
  throw redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

interface useAuthProps {
  logout: (token: string) => Promise<ResponseMessageProps>;
  getCookie: ({ request }: { request: Request }) => Promise<AuthCookieProps>;
  validate: ({ request }: { request: Request }) => Promise<boolean>;
  googleLogin:  () => Promise<void>;
  getGoogleData: (code: string, redirect_url: string) => Promise<any>;
  loginGoogleApi: (props: LoginGoogleApiProps) => Promise<ResponseMessageProps>;
}

export const useAuth: useAuthProps = {
  getCookie: getAuthCookie,
  validate: validate,
  logout: logout,
  googleLogin: googleAuth,
  getGoogleData: getGoogleData,
  loginGoogleApi: loginGoogleApi,
};
