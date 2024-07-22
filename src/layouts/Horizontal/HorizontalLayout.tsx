import {Navbar, NavbarBrand, NavbarContent, Tabs, Tab, Image} from "@nextui-org/react";
import { Outlet, useLocation } from "react-router-dom";


export default function HorizontalLayout() {
  const {pathname} = useLocation();

  const dashboardKey = pathname === '/'  ? '/' : '/dashboard';

  return (
    <>
      <Navbar isBordered>
        <NavbarBrand>
          <Image src="/sikuai.png" alt="Logo" height={100} width={50}/>  
        </NavbarBrand>  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <div className="flex flex-wrap gap-4">
            <Tabs selectedKey={pathname} color={'default'} aria-label="Tabs colors" radius="full">
              <Tab key={dashboardKey} id='/dashboard' href="/dashboard" title="Dashboard" />
              <Tab key='/employee' id="/employee" href="/employee" title="Query" />
              <Tab key= '/events' id="/events" href="/events" title="Attendance" />
              <Tab key='/generator' id="/generator" href="/generator" title="Generator" />
            </Tabs>
          </div>
        </NavbarContent>
        <NavbarContent justify="end">

        </NavbarContent>
      </Navbar> 

      <Outlet />


    </>
  );
}