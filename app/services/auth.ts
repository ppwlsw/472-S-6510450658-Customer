import { redirect } from "react-router";

const APP_URL: string = process.env.APP_URL as string;

export async function requestGoogleLogin() {
  const response = await fetch(`${APP_URL}api/auth/google`, {
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

  const response = await fetch(`${APP_URL}api/auth/login`, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();
   return {
    status: response.status,
    data: response.status === 201 ? json.data: {},
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

  const response = await fetch(`${APP_URL}api/auth/register`, {
    method: "POST",
    body: formData,
  });
  console.log(response);
  
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
  const response = await fetch(`${APP_URL}api/auth/decrypt`, {
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
