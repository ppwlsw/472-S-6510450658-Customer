import { CircleX, Eye, EyeClosed, Fence } from "lucide-react";
import { useState } from "react";
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import {
  authCookie,
  requestDecryptToken,
  requestLogin,
  useAuth,
} from "~/utils/auth";
import { motion } from "framer-motion";
import { defaultFetcherUserInfo } from "~/repositories/user.repository";
import { DataCenter } from "~/provider/datacenter";

interface LoaderReturnProps {
  error: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCookie } = useAuth;
  const existCookie = await getCookie({ request });
  if (existCookie) {
    throw redirect("/homepage");
  }

  const url = new URL(request.url);
  const error: string = url.searchParams.get("error") as string;

  if (error) {
    return {
      error: "อีเมลถูกใช้ไปแล้ว",
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action: string = formData.get("_action") as string;

  if (action === "reset") {
    return null;
  }

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

    const decrypted = (await requestDecryptToken(token)).data
      .plain_text as string;

    const cookie = await authCookie.serialize({
      token: decrypted,
      user_id: user_id,
      role: role,
    });

    const user = await defaultFetcherUserInfo(request, user_id, decrypted);

    DataCenter.addData("user_image_info", user.image_url as string);
    DataCenter.addData("user_name_info", user.name as string);

    return redirect("/homepage", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  if (action === "google_login") {
    const { googleLogin } = useAuth;
    return googleLogin();
  }
}

function GoogleLoginFetcherForm() {
  const fetcher = useFetcher<ActionMessage>();
  return (
    <fetcher.Form
      method="POST"
      className="flex flex-col justify-center items-center gap-6 bg-white-smoke w-full rounded-full p-2 border border-black"
    >
      <button
        name="_action"
        value="google_login"
        type="submit"
        className="flex flex-row items-center justify-center text-lg w-full gap-4"
      >
        <img src="/google-logo.png" alt="google-logo" className="h-6 w-auto" />
        <p>เข้าสู่ระบบด้วย Google</p>
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
      className="flex flex-col justify-center items-center w-full "
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
          className="bg-primary-dark text-white text-lg p-2 rounded-full w-full"
        >
          เข้าสู่ระบบ
        </button>
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
        className="opacity-0 absolute -top-4 left-4 bg-white-smoke p-1"
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

function LoginModal({ fetcherKey }: { fetcherKey: string }) {
  const fetcher = useFetcher<ActionMessage>({
    key: fetcherKey,
  });
  const loader = useLoaderData<LoaderReturnProps>();
  const navigator = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, display: "none" }}
      animate={{
        opacity: 1,
        display:
          fetcher.formData?.get("_action") != "reset" &&
          (fetcher.state === "submitting" ||
            fetcher.data?.error != undefined ||
            (loader != undefined && loader.error))
            ? "flex"
            : "none",
        transition: {
          duration: fetcher.formData?.get("_action") != "reset" ? 1 : 0,
          ease: "easeIn",
        },
      }}
      className="absolute z-50 top-0 flex flex-col justify-center items-center w-full h-full text-obsidian"
      onClick={() => {
        if (loader != undefined && loader.error) {
          navigator("/login");
        }
        fetcher.submit(
          {
            _action: "reset",
          },
          {
            method: "POST",
          }
        );
      }}
    >
      <div className="relative w-full h-full bg-obsidian opacity-25"></div>
      <div className="flex flex-col justify-center items-center gap-3 absolute rounded-lg shadow-lg bg-white-smoke p-6">
        {fetcher.data?.error == undefined && (loader == undefined) ? (
          <span className="inline-block w-[20px] h-[20px] border-4 border-gray-400 rounded-full border-t-white-smoke animate-spin"></span>
        ) : (
          <motion.div
            initial={{
              rotate: 90,
            }}
            animate={{
              rotate: 0,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            <CircleX size={36} color="#F44336" />
          </motion.div>
        )}
        <motion.p
          animate={{
            opacity: 1,
            color:
              fetcher.data?.error != undefined ||
              (loader != undefined && loader.error)
                ? "#F44336"
                : "#0b1215",
            transition: { duration: 0.3, ease: "easeIn" },
          }}
          className="text-xl text-obsidian"
        >
          {fetcher.data?.error != undefined
            ? fetcher.data.error
            : loader != undefined && loader.error
            ? loader.error
            : "กำลังโหลด..."}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Login() {
  const fetcher = useFetcher<ActionMessage>({
    key: "DefaultLoginFetcher",
  });
  return (
    <div className="relative h-svh w-svw bg-primary-dark-50 z-0">
      <h1 className="absolute opacity-0 top-0 left-0 z-40">{fetcher.state}</h1>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col absolute h-2/6 w-full z-10">
          <img
            src="/customer-logo.png"
            alt="customer-logo"
            className="h-full object-contain"
          />
        </div>
        <div className="flex flex-col absolute h-4/6 w-full z-10 bottom-0 ">
          <div className="h-full w-full relative opacity-90 rounded-t-4xl bg-white-smoke shadow-black/80"></div>
          <div className="flex flex-col justify-center items-center absolute top-0 h-full w-full">
            <div className="flex flex-col justify-center items-center h-1/10 w-full">
              <p className="text-3xl text-obsidian ">เข้าสู่ระบบ</p>
            </div>
            <div className="flex flex-col h-9/10 w-full bg-white-smoke rounded-t-4xl shadow-black">
              <div className="flex flex-col justify-between items-center h-full w-full p-8 pt-4 pb-4">
                <div className="flex flex-col justify-center gap-2 h-full w-full">
                  <div className="flex flex-col h-fit w-full">
                    <DefaultLoginFetcherForm />
                  </div>
                  <div className="flex flex-col h-fit w- items-center">
                    <Link
                      to="/forget-password"
                      prefetch="render"
                      className="text-primary-dark"
                    >
                      ลืมรหัสผ่านรึป่าว?
                    </Link>
                  </div>
                  <div className="flex text-center items-center w-full">
                    <span className="flex-grow h-px bg-gray-300"></span>
                    <span className="text-gray-500">Or</span>
                    <span className="flex-grow h-px bg-gray-300"></span>
                  </div>
                  <div className="flex flex-col justify-center items-center h-fit w-full">
                    <GoogleLoginFetcherForm />
                  </div>
                </div>
                <div className="flex justify-center items-center w-full gap-3 h-fit">
                  <p className="text-center text-gray-500">
                    หากคุณยังไม่มีบัญชีกรุณา
                  </p>
                  <Link
                    to="/register"
                    prefetch="render"
                    className="text-primary-dark"
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal fetcherKey="DefaultLoginFetcher" />
    </div>
  );
}
