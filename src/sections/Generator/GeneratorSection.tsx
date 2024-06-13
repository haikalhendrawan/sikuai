import {useState, useEffect} from "react";
import axiosAuth from "../../config/axios";
import { EmployeeDataTypes } from "./types";
import SuratPlhModal from "./SuratPlhModal";
import {useDisclosure, Button} from "@nextui-org/react";

export default function GeneratorSection() {
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  const {isOpen, onOpen, onOpenChange} = useDisclosure(); // surat plh modal

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

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-[url('/bg-effect.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-col w-full items-center justify-center gap-2 mb-10">
          <h1 className="text-3xl font-bold">Generator</h1>
        </div>
        <div className="w-full max-w-[800px] p-4">
          <Button onClick={onOpenChange}>Generate</Button>
        </div>
      </div>

      <SuratPlhModal employee={employee} isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}