import { useState } from "react";
import {Navbar, NavbarBrand, NavbarContent, Tabs, Tab, Image} from "@nextui-org/react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


export default function HorizontalLayout() {
  const {pathname} = useLocation();

  const dashboardKey = pathname === '/'  ? '/' : '/dashboard';

  const [path, setPath] = useState<any>('/');

  const navigate = useNavigate();

  const handleTabChange = (key: any) => {
    setPath(key);
    navigate(key);
  };

  return (
    <>
      <Navbar isBordered>
        <NavbarBrand>
          <Image src="/sikuai.png" alt="Logo" height={70} width={50}/>  
        </NavbarBrand>  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <div className="flex flex-wrap gap-4">
            <Tabs selectedKey={path} color={'default'} aria-label="Tabs colors" radius="full" onSelectionChange={handleTabChange}>
              <Tab key={dashboardKey} id='/dashboard' title="Dashboard" />
              {/* <Tab key='/employee' id="/employee" title="Query" /> */}
              <Tab key= '/events' id="/events" title="Attendance" />
              <Tab key='/generator' id="/generator" title="Generator" />
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