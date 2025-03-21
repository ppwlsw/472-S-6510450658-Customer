import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import SidebarMenu from "~/components/sidebar-menu";
import { DataCenter } from "~/provider/datacenter";
import { useAuth } from "~/utils/auth";

export async function loader({request}:LoaderFunctionArgs) {
    const  { validate } = useAuth;
    await validate({ request });

    const payload = {
        image: DataCenter.getData("user_image_info") as string
    }

    return payload
}

function TransparentNav() {
    const { image } = useLoaderData<typeof loader>()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <div className="relative">
            <Outlet />
            <nav
                className={`fixed top-0 left-0 w-full bg-transparent flex flex-row justify-between items-center px-2 h-[10.4vh] z-30 transition-transform duration-300`}
            >
                <div className="text-white">
                    <AlignJustify width={20} height={20} onClick={toggleMenu} />
                </div>

                <div className="text-white text-2xl font-bold">
                    <Link to="/homepage" prefetch="intent">SeeQ</Link>
                </div>

                <div className='rounded-full bg-zinc-600 w-[47px] h-[47px] overflow-hidden'>
                <Link to="/profile">
                <img
                    src={image}
                    alt="User profile"
                    className="object-cover w-full h-full"
                />
                </Link>
                </div>
            </nav>

            {isMenuOpen && <SidebarMenu onClose={toggleMenu} />}
        </div>
    );
}

export default TransparentNav;
