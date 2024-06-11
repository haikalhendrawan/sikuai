import {useState, useEffect} from "react";
import EmployeeForm from "./EmployeeForm";
import axiosAuth from "../../config/axios";
import { EmployeeDataTypes } from "./types";


export default function EmployeeSection(){
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  useEffect(() => {
    async function getData(){
      try{
        const response = await axiosAuth.get("/getAllEmployee");
        setEmployee(response.data.rows);
      }catch(err){
        console.log(err)
      }
    }

    getData();
  }, [])
  return( 
    <>
      <EmployeeForm employee={employee}/>
    </>
  )
}