import { Outlet } from "@remix-run/react";
import { ChartSpline, UsersRound, Pencil } from "lucide-react";
import { NavItem } from "~/components/merchant-nav-item";

function MerchatNav() {
  return (
    <div className="flex flex-row">
      <nav className="h-screen flex flex-col">
        <section
          id="header"
          className="h-fit flex flex-row items-center p-4 border-b-[1px] border-gray-200"
        >
          <iframe src="../../public/merchant-logo.svg" className="w-11 h-10" />
          <div className="text-2xl font-bold">SeeQ-Merchant</div>
        </section>

        <section id="items" className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-8 ">
            <label htmlFor="dashboard-items">
              <h1 className="mx-4 mt-8 font-bold text-gray-500">Home</h1>
            </label>
            <NavItem icon={<ChartSpline />} label="ภาพรวมร้านค้า" path="" />
            <NavItem icon={<UsersRound />} label="จัดการคิว" path="" />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="manage-store">
              <h1 className="mx-2 mt-4 p-4 font-bold text-gray-500 border-b-[1px] border-gray-200 mb-4">
                Setting
              </h1>
            </label>
            <NavItem icon={<Pencil />} label="จัดการร้านค้า" path="" />
          </div>
        </section>
      </nav>

      <Outlet />
    </div>
  );
}

export default MerchatNav;
