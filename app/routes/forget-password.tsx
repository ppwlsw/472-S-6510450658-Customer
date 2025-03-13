import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { Link, useFetcher, type ActionFunctionArgs } from 'react-router';
import useAxiosInstance from '~/utils/axiosInstance';

export async function action({request}:ActionFunctionArgs) {
    
}

function ForgetPasswordPage(){
    const fetcher = useFetcher();

    return (
        <div className="flex flex-col justify-center items-center h-screen px-10">
            <div className='absolute top-0 w-full'>
                <Link to={"/login"}>
                    <ArrowLeft className="absolute text-black left-4 top-9 transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer" width={30} height={30} />
                </Link>
            </div>
            <div className='border-2 border-black mb-3 rounded-full p-6'>
                <LockKeyhole width={80} height={80}></LockKeyhole>
            </div>
            <h5 className='font-bold mb-2'>มีปัญหากับการ Loggin in รึป่าว?</h5>
            <p className='text-gray-500 text-center mx-3'>กรุณากรอกอีเมลของคุณเพื่อให้ระบบส่งอีเมลสำหรับแก้ไขรหัสผ่านไปให้คุณและตรวจสอบให้แน่ใจว่าไม่ใช่อีเมลปลอม</p>

            <fetcher.Form method='post' className="w-full max-w-sm mt-4 mb-10">
                <div className="flex flex-col w-full">
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="กรุณากรอกอีเมลของคุณที่นี่"
                        className="border border-gray-500 w-full px-3 py-2 rounded-lg"
                    />
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4">
                    ส่ง
                </button>
            </fetcher.Form>

            <div className="flex text-center items-center w-full">
                <span className="flex-grow h-px bg-gray-300"></span>
                <span className="text-gray-500 mx-2">Or</span>
                <span className="flex-grow h-px bg-gray-300"></span>
            </div>

            <div className="flex justify-center items-center w-full gap-3 mt-4">
            <p className="text-center text-gray-500">
              หากคุณยังไม่มีบัญชีกรุณา
            </p>
            <Link to="/register" prefetch="render" className="text-primary-dark">
                สมัครสมาชิก
            </Link>
          </div>

            <div className="absolute bottom-0 w-full">
                <Link 
                    to="/login" 
                    className="block w-full bg-gray-800 hover:bg-blue-600 text-white font-semibold py-4 px-4 mt-4 text-center"
                >
                    กลับไปที่หน้าเข้าสู่ระบบ
                </Link>
            </div>

        </div>
    );
}

export default ForgetPasswordPage;