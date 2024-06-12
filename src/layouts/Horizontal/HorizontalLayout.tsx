import {Navbar, NavbarBrand, NavbarContent, Tabs, Tab, Image} from "@nextui-org/react";
import { Outlet, useLocation } from "react-router-dom";


export default function HorizontalLayout() {
  const {pathname} = useLocation();

  console.log(pathname)
  return (
    <>
      <Navbar isBordered>
        <NavbarBrand>
          <Image src="/sikuai.png" alt="Logo" height={100} width={50}/>  
        </NavbarBrand>  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <div className="flex flex-wrap gap-4">
            <Tabs selectedKey={pathname} color={'default'} aria-label="Tabs colors" radius="full">
              <Tab key='/employee' id="/employee" href="/employee" title="Query" />
              <Tab key= '/events' id="/events" href="/events" title="Attendance" />
              <Tab id="/" href="/" title="Generator" />
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