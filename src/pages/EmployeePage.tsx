import { Helmet } from "react-helmet-async";
import EmployeeSection from "../sections/Employee/EmployeeSection";
import {Tabs, Tab, Link} from "@nextui-org/react";


export default function EmployeePage() {
  return (
    <>
      <Helmet>
        <title>Query</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center h-screen bg-[url('/tail-gradient-reverse.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-row w-full items-center justify-center gap-2">
          {/* <Image src={`/query-cloud.png`} height={100} width={100}></Image> */}
          <h1 className="text-3xl font-bold">Query Data Pegawai</h1>
        </div>
        <div className="w-full  p-4">
          <EmployeeSection />
        </div>
      </div>
    </>
  )
}