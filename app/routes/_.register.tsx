import { CircleX, Eye, EyeClosed, MailCheck } from "lucide-react";
import { useState } from "react";
import {
  Link,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import { requestRegister } from "~/utils/auth";
import { motion } from "framer-motion";

interface ActionMessage {
  message: string;
  error: string;
  status: number;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action: string = formData.get("_action") as string;

  if (action === "reset") {
    return null;
  }

  formData.set("email", (formData.get("email") as string).toLowerCase());
  const error = validateInput(formData);

  if (error) {
    return error;
  }

  const response = await requestRegister({
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
  });

  if (response.status !== 201) {
    return {
      message: "",
      error: response.error,
      status: response.status,
    };
  }

  return {
    message: "ok",
    error: "",
    status: response.status,
  };
}

function validateInput(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;
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
  if (!new RegExp(/^[ก-๙a-zA-Z\s]+$/).test(name) || name.length < 3) {
    return {
      message: "",
      error: "กรุณากรอกชื่อ-สกุล",
      status: 400,
    };
  }
  if (!new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/).test(password)) {
    return {
      message: "",
      error:
        "กรุณากรอกรหัสผ่าน 6 ตัวขึ้นไป ประกอบด้วยตัวเล็ก ตัวใหญ่ และตัวเลข",
      status: 400,
    };
  }
  if (password !== password_confirmation) {
    return {
      message: "",
      error: "รหัสผ่านไม่ตรงกัน",
      status: 400,
    };
  }
  return null;
}

function RegisterFetcherForm() {
  const fetcher = useFetcher<ActionMessage>({
    key: "RegisterFetcher",
  });
  return (
    <fetcher.Form
      method="POST"
      className="flex flex-col w-full rounded-t-[40px]"
    >
      <div
        className="flex flex-col items-center justify-center h-full w-full
            [&>div]:w-full gap-6"
      >
        <InputForm name="email" type="text" label="อีเมล" placeholder="อีเมล" />
        <InputForm
          name="name"
          type="text"
          label="ชื่อ-สกุล"
          placeholder="ชื่อ-สกุล"
        />
        <InputForm
          name="phone"
          type="text"
          label="เบอร์โทร"
          placeholder="เบอร์โทร"
        />
        <InputForm
          name="password"
          type="password"
          label="รหัสผ่าน"
          placeholder="รหัสผ่าน"
        />
        <InputForm
          name="password_confirmation"
          type="password"
          label="รหัสผ่านอีกครั้ง"
          placeholder="รหัสผ่านอีกครั้ง"
        />

        <button
          type="submit"
          className="bg-primary-dark text-white-smoke text-lg p-2 rounded-full w-full"
        >
          สมัครสมาชิก
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
    <div className="flex flex-col relative [&:has(input:focus)>label]:opacity-100">
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
            focus:outline-none focus:placeholder:opacity-0"
        type={showPassword && isPassword ? "text" : type}
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </div>
  );
}

function RegisterModal({ fetcherKey }: { fetcherKey: string }) {
  const fetcher = useFetcher<ActionMessage>({
    key: fetcherKey,
  });
  return (
    <motion.div
      initial={{ opacity: 0, display: "none" }}
      animate={{
        opacity: 1,
        display:
          fetcher.formData?.get("_action") != "reset" &&
          (fetcher.state === "submitting" || fetcher.data?.error != undefined)
            ? "flex"
            : "none",
        transition: {
          duration: fetcher.formData?.get("_action") != "reset" ? 1 : 0,
          ease: "easeIn",
        },
      }}
      className="absolute z-50 top-0 flex flex-col justify-center items-center w-full h-full text-obsidian"
      onClick={() => {
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
      <div className="flex flex-col justify-center items-center gap-3 absolute rounded-lg shadow-lg bg-white-smoke p-6 m-20 text-center">
        {fetcher.data?.message == "ok" ? (
          <motion.div
            initial={{
              rotate: 90,
            }}
            animate={{
              rotate: 0,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            <MailCheck size={36} color="#4CAF50" />
          </motion.div>
        ) : fetcher.data?.error != undefined ? (
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
        ) : (
          <span className="inline-block w-[20px] h-[20px] border-4 border-gray-400 rounded-full border-t-white-smoke animate-spin"></span>
        )}
        <motion.p
          animate={{
            opacity: 1,
            color:
              fetcher.data?.message == "ok"
                ? "#4CAF50"
                : fetcher.data?.error != undefined
                ? "#F44336"
                : "#0b1215",
            transition: { duration: 0.3, ease: "easeIn" },
          }}
          className="text-xl text-obsidian "
        >
          {fetcher.data?.message == "ok"
            ? "กรุณายืนยันอีเมลของท่านเพื่อใช้ในการเข้าสู่ระบบ"
            : fetcher.data?.error != undefined
            ? fetcher.data.error
            : "กำลังโหลด"}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Register() {
  return (
    <div className="relative h-svh w-svw bg-primary-dark-50 z-0">
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col absolute h-1/5 w-full z-10">
          <img
            src="/customer-logo.png"
            alt="customer-logo"
            className="h-full object-contain"
          />
        </div>
        <div className="flex flex-col absolute h-4/5 w-full z-10 bottom-0 ">
          <div className="h-full w-full relative opacity-90 rounded-t-4xl bg-white-smoke shadow-black/80"></div>
          <div className="flex flex-col justify-center items-center absolute top-0 h-full w-full">
            <div className="flex flex-col justify-center items-center h-1/10 w-full">
              <p className="text-3xl text-obsidian ">สมัครสมาชิก</p>
            </div>
            <div className="flex flex-col h-9/10 w-full bg-white-smoke rounded-t-4xl shadow-black">
              <div className="flex flex-col justify-between items-center h-full w-full p-8 pt-4 pb-4">
                <div className="flex flex-col justify-center gap-2 h-full w-full">
                  <div className="flex flex-col h-fit w-full">
                    <RegisterFetcherForm />
                  </div>
                  <div className="flex flex-col justify-center items-center h-fit w-full"></div>
                </div>
                <div className="flex justify-center items-center w-full gap-3 h-fit">
                  <p>
                    <span className="text-gray-500">มีบัญชีอยู่แล้ว? </span>
                    <Link
                      to="/login"
                      prefetch="viewport"
                      className="text-primary-dark"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RegisterModal fetcherKey="RegisterFetcher" />
    </div>
  );
}
