import { ArrowLeft, Lock, Pencil, Loader } from 'lucide-react';
import GapController from '~/components/gap-control';
import React, { useRef } from 'react';
import { z } from 'zod';
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
  type ActionFunction,
  type LoaderFunctionArgs
} from 'react-router';
import { fetchUserInfo, updateUserAvatar, updateUserInfo } from '~/repositories/user.repository';
import type { User } from '~/types/user';
import { sendForgetPasswordRequest } from '~/repositories/auth.repository';
import { prefetchImage } from '~/utils/image-proxy';

const profileSchema = z.object({
  name: z.string().min(2, "ชื่อคุณต้องยาวกว่า 2 ตัวอักษร"),
  email: z.string().email("กรุณากรอกอีเมลที่ถูกรูปแบบ"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "หมายเลขโทรศัพท์ต้องมี 10 ตัว"),
  image_url: z.string().min(3, "url ต้องยาวอย่างน้อย 3 ตัว")
})

type ProfileFormData = z.infer<typeof profileSchema>

interface InputFieldProps {
  name: string;
  type: string;
  example: string;
  id: string;
  defaultValue?: string;
  error?: string;
  readonly?: boolean;
}

function InputField({ name, type, example, id, defaultValue, error, readonly }: InputFieldProps) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm font-normal leading-normal">
        {name} {readonly && <span className="text-gray-500 text-xs">(ไม่สามารถแก้ไขได้)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={example}
        defaultValue={defaultValue}
        readOnly={readonly}
        className={`border ${error ? 'border-red-500' : 'border-gray-500'} ${
          readonly ? 'bg-gray-200 cursor-not-allowed opacity-80 text-gray-500' : 'bg-gray-300/0'
        } rounded-lg p-2 w-full`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
  name?: string;
  value?: string;
}

function Button({ children, variant = "primary", icon = null, type = "button", name, value }: ButtonProps) {
  const baseStyles = "flex justify-center items-center py-2 rounded-xl w-full font-bold transition-all duration-200 ease-in-out";
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-gray-800 hover:shadow-md",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100 hover:shadow-md"
  };

  return (
    <button
      type={type}
      name={name}
      value={value}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

interface ActionMessage {
  message?: string;
  status?: number;
  success?: boolean;
  errors?: Record<string, string[]>;
  values?: ProfileFormData;
  passwordChange?: {
    success: boolean;
    message: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const toast = url.searchParams.get('toast');
  const toastType = url.searchParams.get('toastType');
  
  const user: User = await fetchUserInfo(102, request);
  const image_url  = await prefetchImage(user.data.image_url);
  const profileData: ProfileFormData = {
    name: user.data.name,
    email: user.data.email,
    phoneNumber: user.data.phone,
    image_url: image_url
  };

  return { 
    user: profileData,
    toast: toast || null,
    toastType: toastType || 'success'
  };
}

export const action: ActionFunction = async({ request }) => {
  const form = await request.formData();
  const intent = form.get("intent") as string;
  const redirectUrl = new URL(request.url);
  
  if(intent === "updateProfile"){
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phoneNumber = form.get("phoneNumber") as string;
    const image_url = form.get("image_url") as string;
    
    const payload = profileSchema.safeParse({name, email, phoneNumber, image_url});
    
    if(!payload.success){
      return ({
        success: false,
        errors: payload.error.flatten().fieldErrors,
        values: {name, email, phoneNumber, image_url}
      });
    }

    try{
      await updateUserInfo(request, 102, {name:name, phone:phoneNumber});
      redirectUrl.searchParams.set('toast', 'อัพเดทข้อมูลในโปรไฟล์คุณเรียบร้อยแล้วครับ');
      redirectUrl.searchParams.set('toastType', 'success');
      return Response.redirect(redirectUrl.toString());
    } catch(e){
      return ({
        success: false,
        message: "Can't update user profile",
        values: {name, email, phoneNumber, image_url}
      });
    }
  } else if (intent === "changePassword"){
    const email = form.get("email") as string;

    const success = await sendForgetPasswordRequest(request, email)

    if(success){
      redirectUrl.searchParams.set('toast', 'ส่งลิ้งค์อัพเดทรหัสผ่านไปทางอีเมลเรียบร้อยแล้วครับ');
      redirectUrl.searchParams.set('toastType', 'success');
    }else{
      redirectUrl.searchParams.set('toast', 'ส่งลิ้งค์อัพเดทรหัสผ่านไม่สำเร็จ');
      redirectUrl.searchParams.set('toastType', 'error');
    }

    return Response.redirect(redirectUrl.toString());

  } else if (intent === "updateImage"){
    const imageFile = form.get("file") as File | null;

    if(imageFile){
      try{
        await updateUserAvatar(request, 102, imageFile);
        
        redirectUrl.searchParams.set('toast', 'อัพเดทรูปโปรไฟล์ของคุณเรียบร้อบแล้วครับ');
        redirectUrl.searchParams.set('toastType', 'success');

        return Response.redirect(redirectUrl.toString());
      } catch(e){
        redirectUrl.searchParams.set('toast', 'อัพเดทรูปโปรไฟล์ไม่สำเร็จ');
        redirectUrl.searchParams.set('toastType', 'error');

        return Response.redirect(redirectUrl.toString());
      }
    }
  }

  return null;
}

function ProfileEditPage() {
  const { user, toast, toastType } = useLoaderData<{ 
    user: ProfileFormData;
    toast: string | null;
    toastType: 'success' | 'error';
  }>();
  const imageUploadFetcher = useFetcher();
  const profileFetcher = useFetcher<ActionMessage>();
  const nav = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isImageUploading = 
    (imageUploadFetcher.state === 'submitting' && 
     imageUploadFetcher.formData?.get('intent') === 'updateImage');
  
  const isSubmitting = nav.state === 'submitting';
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("intent", "updateImage");

    imageUploadFetcher.submit(formData, { method: "post", encType: "multipart/form-data" });
  };
  
  if (toast) {
    setTimeout(() => {
      searchParams.delete('toast');
      searchParams.delete('toastType');
      setSearchParams(searchParams);
    }, 3000);
  }

  return (
    <div className="h-screen bg-primary-white-smoke">
      <nav className="bg-primary-dark h-[19.6vh] flex justify-center">
        <h1 className="font-bold text-lg text-white mt-4">Edit Profile</h1>
        <Link to={"/profile"}>
          <ArrowLeft className="absolute left-4 top-9 transform -translate-y-1/2 text-white hover:scale-110 transition-transform cursor-pointer" width={30} height={30} />
        </Link>
      </nav>
      <div className="h-auto flex flex-col items-center pb-8">
        <div className="relative">
          <div 
            className="rounded-full w-40 h-40 -mt-20 border-4 border-white mb-8 relative overflow-hidden cursor-pointer"
            onClick={() => !isImageUploading && document.getElementById("fileInput")?.click()}
          >
            <img 
              src={profileFetcher.data?.values?.image_url || user?.image_url || "/default.png"}
              alt="Profile" 
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Pencil size={28} className="text-white" />
            </div>

            {isImageUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader className="animate-spin text-white" size={40} />
              </div>
            )}
          </div>
          <div className='absolute right-3 bottom-7 bg-white text-black rounded-full p-2 border-[1px] border-gray-200'>
            <Pencil size={28} />
          </div>
          

          <input 
            type="file" 
            id="fileInput" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isImageUploading}
          />
        </div>
        
        <profileFetcher.Form method="post" className="w-full">
          <input type="hidden" name="image_url" value={user?.image_url || ""} />
          <div className="w-full px-4 md:px-16">
            <GapController gap={19} y_axis={true}>
              <InputField
                name="Email"
                type="email"
                example="bigdog@gmail.com"
                id="email"
                readonly={true}
                defaultValue={profileFetcher.data?.values?.email || user?.email || "" }
                error={profileFetcher.data?.errors?.email?.[0]}
              />
              <InputField
                name="Name"
                type="text"
                example="YoungJ"
                id="name"
                defaultValue={profileFetcher.data?.values?.name || user?.name || ""}
                error={profileFetcher.data?.errors?.name?.[0]}
              />
              <InputField
                name="Phone Number"
                type="tel"
                example="0922720521"
                id="phoneNumber"
                defaultValue={profileFetcher.data?.values?.phoneNumber || user?.phoneNumber || ""}
                error={profileFetcher.data?.errors?.phoneNumber?.[0]}
              />
            </GapController>
          </div>
          <div className="px-4 md:px-20 w-full mt-8">
            <Button
              variant="secondary"
              icon={<Lock size={16} />}
              type="submit"
              name="intent"
              value="changePassword"
            >
              Change Password
            </Button>
          </div>
          <div className="px-4 md:px-20 w-full mt-4">
            <Button
              variant="primary"
              type="submit"
              name="intent"
              value="updateProfile"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </profileFetcher.Form>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 flex items-center p-4 rounded-lg shadow-lg ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } animate-fade-out`} style={{ animation: 'fadeOut 3s forwards' }}>
          {toastType === 'success' ? (
            <div className="mr-2">✓</div>
          ) : (
            <div className="mr-2">✗</div>
          )}
          <span>{toast}</span>
        </div>
      )}
      
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default ProfileEditPage;