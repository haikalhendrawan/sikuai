import {useState, useEffect} from "react";
import AttendanceForm from "./AttendanceForm";
import AttendanceSubmitted from "./AttendanceSubmitted";
import axiosAuth from "../../config/axios";
import { AddAttendanceBody, TodayEventsType } from "./types";
import toast , {Toaster} from 'react-hot-toast';


export default function AttendanceSection(){
  const [todayEvents, setTodayEvents] = useState<TodayEventsType[] | [] >([]);
  
  const [section, setSection] = useState<0 | 1>(0);

  const SECTION = [
    <AttendanceForm addAttendance={addAttendance} todayEvents={todayEvents}/>, 
    <AttendanceSubmitted />
  ];
  
  async function addAttendance(body: AddAttendanceBody) {
    try{
      await axiosAuth.post(`/addAttendance`, body);
      setSection(1);
    }catch(err: any){
      throw err
    }
  };

  async function getTodayEvents() {
    try{
      const response = await axiosAuth.get("/getTodayEvent");
      const mapped = response.data.rows.map((event: any, index: number) => ({
        key: index+1,
        ...event,
      }));
      setTodayEvents(mapped);
    }catch(err: any){
      if(err.response){
        console.log(err)
        toast.error(err.response.data.message, {
          position: 'top-right',
          className:'text-sm'
        });
      }else{
        console.log(err)
        toast.error(err.message, {
          position: 'top-right',
          className:'text-sm'
        });
      }
    }
  };

  useEffect(() => {
    getTodayEvents()
  }, [])

  return(
    <>
      {SECTION[section]}
    </>
  )
}