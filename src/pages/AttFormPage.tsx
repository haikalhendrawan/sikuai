import { Helmet} from "react-helmet-async";
import AttendanceSection from "../sections/Attendance/AttendanceSection";

export default function AttFormPage() {
  return (
    <>
      <Helmet>
        <title>Attendance Page</title>
      </Helmet>
      
      <div className="flex items-center justify-center h-screen bg-no-repeat bg-cover bg-[url('/tail-gradient.png')]" >
        <AttendanceSection />
      </div>
    </>
  )
}