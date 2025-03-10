import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import {
  Link,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { requestDecryptToken, requestGoogleLogin, requestLogin } from "~/services/auth";
import { authCookie, type AuthCookieProps } from "~/services/cookie";
import { motion } from "framer-motion";


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token: string = url.searchParams.get("token") as string;
  if (token) {
    const decrypted = (await requestDecryptToken(token)).data;
    const cookie = await authCookie.serialize(decrypted);
    return redirect("/homepage", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action: string = formData.get("_action") as string;
  if (action === "default_login") {
    formData.set("email", (formData.get("email") as string).toLowerCase());
    const error = validateInput(formData);

    if (error) {
      return error;
    }

    const response = await requestLogin({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (response.status !== 201) {
      return {
        message: "",
        error: response.error,
        status: response.status,
      };
    }

    if (response.data.role !== "CUSTOMER") {
      return {
        message: "",
        error: "คุณไม่มีสิทธิ์เข้าใช้งาน",
        status: 403,
      };
    }

    const token: string = response.data.token;
    const user_id: number = response.data.id;
    const role: string = response.data.role;

    const decrypted = (await requestDecryptToken(token)).data.plain_text as string;
    const cookie = await authCookie.serialize({
      token: decrypted,
      user_id: user_id,
      role: role,
    } as AuthCookieProps);

    return redirect("/homepage", {
      headers: {
        "Set-Cookie": cookie,
      },
    }); 
  }

  if (action === "google_login") {
    return await requestGoogleLogin(); 
  }
}

function GoogleLoginFetcherForm() {
  const fetcher = useFetcher<ActionMessage>();
  return (
    <fetcher.Form
      method="POST"
      className="flex justify-center items-center gap-6 bg-white w-full rounded-full p-4 border border-black"
    >
      <img src="/google-logo.png" alt="google-logo" className="h-6 w-auto" />
      <button name="_action" value="google_login" type="submit" className="text-lg">
        เข้าสู่ระบบด้วย Google
      </button>
    </fetcher.Form>
  );
}

function DefaultLoginFetcherForm() {
  const fetcher = useFetcher<ActionMessage>({
    key: "DefaultLoginFetcher",
  });
  return (
    <fetcher.Form
      method="POST"
      className="flex flex-col justify-start items-center w-full "
    >
      <div className="flex flex-col justify-evenly items-center w-full gap-6">
        <InputForm name="email" type="text" label="อีเมล" placeholder="อีเมล" />

        <InputForm
          name="password"
          type="password"
          label="รหัสผ่าน"
          placeholder="รหัสผ่าน"
        />
        
        <button
          name="_action"
          value="default_login"
          type="submit"
          className="bg-primary-dark text-white text-xl p-4 rounded-full w-full"
        >
          เข้าสู่ระบบ
        </button>
        <p
          className={`w-full text-red-500 text-center border border-red-500 bg-red-100 p-1 rounded-md ${
            fetcher.data?.error && fetcher.state === 'idle' ? "opacity-100" : "opacity-0"
          }`}
        >
          {fetcher.data?.error ? fetcher.data.error : "error"}
        </p>
      </div>
    </fetcher.Form>
  );
}

interface InputFormProps {
  name: string;
  type: string;
  label: string;
  placeholder: string;
}

function InputForm({ name, type, label, placeholder }: InputFormProps) {
  let isPassword = type === "password";
  let [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col relative [&:has(input:focus)>label]:opacity-100 w-full">
      <label
        className="opacity-0 absolute -top-4 left-4 bg-white p-1"
        htmlFor={name}
      >
        {label}
      </label>

      {isPassword && showPassword && (
        <Eye
          className="absolute right-4 top-4 text-gray-500"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      )}

      {isPassword && !showPassword && (
        <EyeClosed
          className="absolute right-4 top-4 text-gray-500"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      )}

      <input
        className="border border-gray-300 p-3 rounded-md focus:border-primary-dark 
                focus:outline-none focus:placeholder:opacity-0 w-full"
        type={showPassword && isPassword ? "text" : type}
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </div>
  );
}

interface ActionMessage {
  message: string;
  error: string;
  status: number;
}

function validateInput(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (
    !new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(
      email as string
    )
  ) {
    return {
      message: "",
      error: "กรุณากรอกอีเมล",
      status: 400,
    };
  }
  if (!password) {
    return {
      message: "",
      error: "กรุณากรอกรหัสผ่าน",
      status: 400,
    };
  }
  return null;
}

function LoadingModal({ state }: { state: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, display: "none" }}
      animate={{
        opacity: 1,
        display: state === "submitting" ? "flex" : "none",
        transition: { duration: 1, ease: "easeIn" },
      }}
      className="flex flex-col justify-center items-center absolute w-full h-full z-50 text-obsidian"
    >
      <div className="relative w-full h-full bg-obsidian opacity-25"></div>
      <div className="flex flex-col justify-center items-center gap-3 absolute rounded-lg shadow-lg bg-white-smoke p-6">
        <p className="text-xl text-obsidian">กำลังโหลด...</p>
        <span className="inline-block w-[20px] h-[20px] border-4 border-gray-400 rounded-full border-t-white-smoke animate-spin"></span>
      </div>
    </motion.div>
  );
}

export default function Login() {
  const fetcher = useFetcher<ActionMessage>({
    key: "DefaultLoginFetcher",
  });
  return (
    <div className="flex flex-col justify-end h-screen bg-primary-dark-50 overflow-hidden relative">
      <div className="flex flex-col justify-center items-center w-full absolute top-[15%]">
        <img src="/register-logo.png" alt="logo" className="h-60 w-auto" />
      </div>
      <div className="grid grid-cols-1 justify-center items-center z-50">
        <div className="h-full col-start-1 row-start-1 bg-gray-100 rounded-t-[40px]">
          <p className="mt-4 text-center text-3xl">เข้าสู่ระบบ</p>
        </div>
        <div className="flex flex-col items-center gap-3 col-start-1 row-start-1 h-full w-full mt-32 bg-white borde shadow-lg shadow-black/80 rounded-t-[40px] p-16 pt-8 pb-0">
          <DefaultLoginFetcherForm />
          <div className="flex text-center items-center w-full">
            <span className="flex-grow h-px bg-gray-300"></span>
            <span className="text-gray-500">Or</span>
            <span className="flex-grow h-px bg-gray-300"></span>
          </div>
          <GoogleLoginFetcherForm />
          <div className="flex justify-center items-center w-full gap-3 mt-4">
            <p className="text-center text-gray-500">
              หากคุณยังไม่มีบัญชีกรุณา
            </p>
            <Link to="/register" prefetch="render" className="text-primary-dark">
                สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>

      <LoadingModal state={fetcher.state} />
    </div>
  );
}
