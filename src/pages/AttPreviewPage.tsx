import { useEffect, useState } from "react";
import { Helmet} from "react-helmet-async";
import { useParams } from "react-router-dom";
import AttendanceReport from "../sections/PDF/AttendanceReport";
import {Spinner} from "@nextui-org/react";
import { AttendanceEventBody } from "../sections/PDF/types";
import axiosAuth from "../config/axios";
import Footer from "../components/Footer";

//---------------------------------------------------------------------------------------------------------
export default function AttPreviewPage() {
  const id = useParams().id;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [attendance, setAttendance] = useState<AttendanceEventBody[] | []>([]);

  async function getData(){
    const now = new Date().getTime();
    try{
      setIsLoading(true);
      const response = await axiosAuth.post("/getAttendanceByEvent?now=" + now , {eventId: id});
      setAttendance(response.data.rows);
      setIsLoading(false);
    }catch(err){
      setIsLoading(false);
      console.log(err)
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  },[])

  return (
    <>
      <Helmet>
        <title>Preview Attendance</title>
      </Helmet>
      
      <div className="flex items-center justify-center h-screen bg-no-repeat bg-cover bg-[url('/tail-gradient.png')]">
        {isLoading
          ? <Spinner/>
          :
            <div className='w-full max-w-[800px] '>
              <AttendanceReport attendance={attendance}/>
              <Footer/>
            </div>
        }


      </div>
    </>
  )
}