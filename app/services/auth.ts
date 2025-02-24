import { redirect } from "react-router";

const APP_URL: string = process.env.APP_URL as string;

export async function requestGoogleLogin() {
  console.log('requestGoogleLogin');
  const response = await fetch(`${APP_URL}api/auth/google`, {
    method: "GET",
  });
  const json = await response.json();
  return redirect(json.url as string);
}

interface ResponseMessageProps {
  data: string;
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

  const response = await fetch(`${APP_URL}api/login`, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
  const token:string = json["token"] as string;

  return {
    status: response.status,
    data: response.status === 201 ? token : "",
    error:
      response.status === 201
        ? ""
        : response.status === 404
        ? "ไม่พบข้อมูล"
        : response.status === 401
        ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        : "เกิดข้อผิดพลาด",
  };
}

export async function requestDecryptToken(
  token: string
): Promise<ResponseMessageProps> {
  const formData = new FormData();
  formData.set("encrypted", token);
  const response = await fetch(`${APP_URL}api/auth/decrypt`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  return {
    data: json.plain_text as string,
    status: response.status,
    error: response.status === 500 ? "เกิดข้อผิดพลาด" : "",
  };
}
