import { Outlet } from "@remix-run/react";
import { AlignJustify } from "lucide-react";
import { Link } from "@remix-run/react";

function TransparentNav() {
    return (
        <div className="relative">
            <Outlet></Outlet>
            <nav className="fixed top-0 left-0 w-full bg-transparent flex flex-row justify-between items-center px-2 h-[10.4vh] z-50">
                <div className="text-white">
                    <AlignJustify width={20} height={20} />
                </div>

                <div className="text-white text-2xl font-bold">
                    <Link to="/homepage" prefetch="intent">SeeQ</Link>
                </div>

                <div className="rounded-full bg-zinc-600 w-[47px] h-[47px]"></div>
            </nav>
        </div>
    );
}

export default TransparentNav;
