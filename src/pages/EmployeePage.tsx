import { Helmet } from "react-helmet-async";
import {Image} from "@nextui-org/react";
import EmployeeSection from "../sections/Employee/EmployeeSection";


export default function EmployeePage() {
  return (
    <>
      <Helmet>
        <title>Query | SIKUAI</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center h-screen bg-[url('/tail-gradient-reverse.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-row w-full items-center justify-center gap-2">
          {/* <Image src="/sikuai.png" width={100} height={100} /> */}
          <h1 className="text-3xl font-bold">Query Data Pegawai</h1>
        </div>
        <div className="w-full  p-4">
          <EmployeeSection />
        </div>
      </div>
    </>
  )
}