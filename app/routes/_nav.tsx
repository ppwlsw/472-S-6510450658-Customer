import { Link, Outlet} from 'react-router';
import { AlignJustify } from 'lucide-react';
import {useState } from 'react';
import SidebarMenu from '~/components/sidebar-menu';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    
    return (
        <div className='flex flex-col mb-0'>
            <nav className='flex flex-row bg-primary-dark justify-between items-center px-2 h-[10.4vh]'>
                <div className='text-white' onClick={toggleMenu}>
                    <AlignJustify width={20} height={20} />
                </div>

                <div className='text-white text-2xl font-bold'>
                    <Link to="/homepage" prefetch="intent">SeeQ</Link>
                </div>

                <div className='rounded-full bg-zinc-600 w-[47px] h-[47px] overflow-hidden'>
                {/* <img
                    src={user.data.image_url || defaultImage}
                    alt="User profile"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                    e.currentTarget.src = defaultImage;
                    }}
                /> */}
                </div>
            </nav>

            <Outlet />

            {isMenuOpen && (
                <SidebarMenu onClose={toggleMenu} />
            )}
        </div>
    );
}

export default Nav;