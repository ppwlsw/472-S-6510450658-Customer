import { Link, Outlet } from '@remix-run/react';
import { AlignJustify } from 'lucide-react';

function Nav(){
    return <div className='flex flex-col'>
            <nav className='flex flex-row bg-primary-dark justify-between items-center px-2 h-[10.4vh]'>
            <div className='text-white'>
                <AlignJustify width={20} height={20}></AlignJustify>
            </div>

            <div className='text-white text-2xl font-bold'>
                <Link to="/homepage" prefetch="intent">SeeQ</Link>
            </div>

            <div className='rounded-full bg-zinc-600 w-[47px] h-[47px]'>
            </div>
        </nav>
        <Outlet></Outlet>
    </div>
}

export default Nav