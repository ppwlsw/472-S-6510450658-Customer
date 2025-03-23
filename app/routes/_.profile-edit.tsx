import { ArrowLeft, Lock, Pencil } from 'lucide-react';
import GapController from '~/components/gap-control';
import React, { useRef } from 'react';
import { z } from 'zod';
import {
    Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
  type ActionFunction,
  type LoaderFunctionArgs
} from 'react-router'; 
import { ProfileProvider } from './dummy/ProfileDev';
import { fetchUserInfo, updateUserInfo } from '~/repositories/user.repository';
import type { User } from '~/types/user';

const profileSchema = z.object({
    name: z.string().min(2, "Your name must longer than 2 charactors"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    image_url: z.string().min(2, "Must have image") // TODO: fix to check URL after this
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


interface ActionMessage{
    message?:string;
    status?:number;
    success?: boolean;
    errors?: Record<string, string[]>;
    values?: ProfileFormData;
    passwordChange?: {
      success: boolean;
      message: string;
    };
}

export async function loader({ request }: LoaderFunctionArgs) {
    const user: User = await fetchUserInfo(117, request);
    const profileData: ProfileFormData = {
      name: user.data.name,
      email: user.data.email,
      phoneNumber: user.data.phone,
      image_url: user.data.image_url
  };

  return { user: profileData };
}

export const action:ActionFunction = async({request}) => {
    const form = await request.formData();
    const intent = form.get("intent") as string
    if(intent === "updateProfile"){
        const name = form.get("name") as string;
        const email = form.get("email") as string;
        const phoneNumber = form.get("phoneNumber") as string;
        const image_url = form.get("image_url") as string

        console.log(name, email, phoneNumber, image_url)
        
        const payload = profileSchema.safeParse({name, email, phoneNumber, image_url})
        
        if(!payload.success){
            return ({
                success: false,
                errors: payload.error.flatten().fieldErrors,
                values: {name, email, phoneNumber, image_url}
            });
        }

        try{
            await updateUserInfo(request, 117, {name:name, phone:phoneNumber});
            return ({
              success: true,
              message: "Profile updated successfully"
            });
        }catch(e){
            return (
                {
                    success: false,
                    message: "Can't update user profile",
                    values: {name, email, phoneNumber, image_url}
                }
            );
        }
    }else if (intent === "changePassword"){
      return ({
        // wait for api (LOGIC)
        passwordChange: {
          success: true,
          message: "Password reset link sent to your email"
        }
      });
    }

    return null;
}

function ProfileEditPage(){
  const {user} = useLoaderData<{user: ProfileFormData}>();
  const fetcher = useFetcher<ActionMessage>();
  const nav = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = nav.state === 'submitting';
  
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //for future implement some way some how.
    const file = event.target.files?.[0];
    if (file) {
      
      const imageUrl = URL.createObjectURL(file);
      
      const imageUrlInput = document.getElementById('image_url') as HTMLInputElement;
      if (imageUrlInput) {
        imageUrlInput.value = imageUrl;
      }
    }
  };

  return (
      <div className="h-screen bg-primary-white-smoke">
        <nav className="bg-primary-dark h-[19.6vh] flex justify-center">
          <h1 className="font-bold text-lg text-white mt-4">Edit Profile</h1>
          <Link to={"/profile"}>
            <ArrowLeft className="absolute left-4 top-9 transform -translate-y-1/2 text-white hover:scale-110 transition-transform cursor-pointer" width={30} height={30} />
          </Link>
        </nav>
        <div className="h-auto flex flex-col items-center pb-8">
          <div className="relative" onClick={handleImageClick}>
            <img src={fetcher.data?.values?.image_url || user?.image_url || "/default.png"} alt="Profile" className="rounded-full w-40 h-40 object-cover -mt-20 z-10 border-4 border-white mb-8" />
            <div 
              className="absolute bottom-9 right-2 bg-white rounded-full p-2 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Pencil size={28} className="text-gray-600" />
            </div>
          </div>
          
          <fetcher.Form method="put" className="w-full">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <div className="w-full px-4 md:px-16">
              <GapController gap={19} y_axis={true}>
              <input 
                type="hidden" 
                name="image_url" 
                id="image_url"
                value={fetcher.data?.values?.image_url || user?.image_url || "/default.png"} 
              />
              <InputField
                  name="Email"
                  type="email"
                  example="your.email@example.com"
                  id="email"
                  readonly={true}
                  defaultValue={fetcher.data?.values?.email || user?.email || "" }
                  error={fetcher.data?.errors?.email?.[0]}
                />
                <InputField
                  name="Name"
                  type="text"
                  example="Your name"
                  id="name"
                  defaultValue={fetcher.data?.values?.name || user?.name || ""}
                  error={fetcher.data?.errors?.name?.[0]}
                />
                <InputField
                  name="Phone Number"
                  type="tel"
                  example="0000000000"
                  id="phoneNumber"
                  defaultValue={fetcher.data?.values?.phoneNumber || user?.phoneNumber || ""}
                  error={fetcher.data?.errors?.phoneNumber?.[0]}
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
          </fetcher.Form>
        </div>
      </div>
    );
}

export default ProfileEditPage;