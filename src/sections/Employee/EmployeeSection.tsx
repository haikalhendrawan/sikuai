import {useState, useEffect} from "react";
import EmployeeForm from "./EmployeeForm";
import axiosAuth from "../../config/axios";
import { EmployeeDataTypes } from "./types";
import toast, {Toaster} from 'react-hot-toast';


export default function EmployeeSection(){
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  useEffect(() => {
    async function getData(){
      try{
        const response = await axiosAuth.get("/getAllEmployee");
        setEmployee(response.data.rows);
      }catch(err: any){
        if(err.response){
          console.log(err)
          return toast.error(err.response.data.message, {
            position: 'top-right',
            className:'text-sm'
          });
        }else{
          console.log(err)
          return toast.error(err.message, {
            position: 'top-right',
            className:'text-sm'
          });
        }
      }
    }

    getData();
  }, [])
  return( 
    <>
      <EmployeeForm employee={employee}/>
      <Toaster />
    </>
  )
}