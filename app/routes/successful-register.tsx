import { Link, useFetcher } from "@remix-run/react";

export default function SuccessfulRegister() {
  const fetcher = useFetcher();
  return (
    <div className="grid grid-cols-1 items-center h-svh bg-white">
      <img
        src="/public/successful-register-bg.png"
        alt="logo"
        className="w-full h-[50%] object-cover object-[10%_90%] col-start-1 row-start-1"
      />
      <div className="flex flex-col justify-center items-center w-full h-svh col-start-1 row-start-1 p-8 gap-6">
        <p
          className="text-yellow-500 w-fit text-xm bg-yellow-100 text-center p-1 
                rounded-md border border-yellow-500"
        >
          ระบบได้ทำการส่งอีเมลยืนยันแล้ว
          กรุณายืนยันอีเมลของท่านเพื่อใช้ในการเข้าสู่ระบบ
        </p>
        <Link to="/login" prefetch="viewport" className="text-white text-xl bg-primary-dark w-fit p-4 rounded-md">
          ตกลง
        </Link>
      </div>
    </div>
  );
}
