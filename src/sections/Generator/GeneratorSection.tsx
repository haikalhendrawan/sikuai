import {useState, useEffect} from "react";
import axiosAuth from "../../config/axios";
import { EmployeeDataTypes } from "./types";
import SuratPlhModal from "./SuratPlhModal";
import SuratLAMPModal from "./SuratLAMPModal";
import SuratTugasModal from "./SuratTugasModal";
import {useDisclosure} from "@nextui-org/react";
import GeneratorCard from "./GeneratorCard";
import toast , {Toaster} from 'react-hot-toast';

export default function GeneratorSection() {
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  const {isOpen, onOpenChange} = useDisclosure(); // surat plh modal

  const {isOpen: isOpen2, onOpenChange: onOpenChange2} = useDisclosure(); // surat LAMP modal

  const {isOpen: isOpen3, onOpenChange: onOpenChange3} = useDisclosure(); // surat tugas modal

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

  return (
    <>
      <div className="w-full grid grid-cols-4 max-w-[900px] gap-4 p-4">
        <GeneratorCard 
          onOpenChange={onOpenChange} 
          title="Surat Perintah (Plh/Plt)" 
          imageUrl="/surat-perintah.png" 
        />
        <GeneratorCard 
          onOpenChange={onOpenChange2} 
          title="Surat Lupa Absen (LAP/LAM)" 
          imageUrl="/surat-LAMP.png" 
        />
        <GeneratorCard 
          onOpenChange={onOpenChange3} 
          title="Surat Tugas (ST) Diklat" 
          imageUrl="/plh.png" 
        />
        {/* <GeneratorCard 
          onOpenChange={onOpenChange} 
          title="Surat Keputusan (SK)" 
          imageUrl="/plh.png" 
        /> */}
      </div>

      <SuratPlhModal employee={employee} isOpen={isOpen} onOpenChange={onOpenChange} />

      <SuratLAMPModal employee={employee} isOpen={isOpen2} onOpenChange={onOpenChange2} />

      <SuratTugasModal employee={employee} isOpen={isOpen3} onOpenChange={onOpenChange3} />
      
      <Toaster />
    </>
  )
}