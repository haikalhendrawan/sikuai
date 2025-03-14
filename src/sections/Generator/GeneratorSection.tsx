import {useState, useEffect} from "react";
import axiosAuth from "../../config/axios";
import { EmployeeDataTypes } from "./types";
import {useDisclosure} from "@nextui-org/react";
import GeneratorCard from "./GeneratorCard";
import toast , {Toaster} from 'react-hot-toast';
import SuratPlhModal from "./SuratPlhModal";
import SuratLAMPModal from "./SuratLAMPModal";
import SuratTugasDiklatModal from "./SuratTugasDiklatModal";
import SuratTugasKegModal from "./SuratTugasKegModal";
import SuratIzinBelajarModal from "./SuratIzinBelajarModal";
import SuratSPMMJModal from "./SuratSPMMJModal";
import SuratSPMTModal from "./SuratSPMTModal";
import SuratSKKegiatanModal from "./SuratSKKegiatanModal/SuratSKKegiatanModal";
//-----------------------------------------------------------------------------------------------------------
export default function GeneratorSection() {
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  const {isOpen, onOpenChange} = useDisclosure(); // surat plh modal

  const {isOpen: isOpen2, onOpenChange: onOpenChange2} = useDisclosure(); // surat LAMP modal

  const {isOpen: isOpen3, onOpenChange: onOpenChange3} = useDisclosure(); // surat tugas diklat modal

  const {isOpen: isOpen4, onOpenChange: onOpenChange4} = useDisclosure(); // surat tugas kegiatan modal

  const {isOpen: isOpen5, onOpenChange: onOpenChange5} = useDisclosure(); // surat izin belajar modal

  const {isOpen: isOpen6, onOpenChange: onOpenChange6} = useDisclosure(); // surat PMMJ modal

  const {isOpen: isOpen7, onOpenChange: onOpenChange7} = useDisclosure(); // surat SPMT modal

  const {isOpen: isOpen8, onOpenChange: onOpenChange8} = useDisclosure(); // surat SK Kegiatan modal

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
      <div className="w-full grid grid-cols-4 max-w-[900px] gap-8 p-4">
        <GeneratorCard 
          onOpenChange={onOpenChange2} 
          title="Surat Lupa Absen" 
          imageUrl="/surat-LAMP.png" 
        />
        <GeneratorCard 
          onOpenChange={onOpenChange} 
          title="Surat Perintah (Plh/Plt)" 
          imageUrl="/surat-perintah.png" 
        />
        <GeneratorCard 
          onOpenChange={onOpenChange3} 
          title="Surat Tugas (ST) Diklat" 
          imageUrl="/surat-tugas-diklat.png" 
        />
        <GeneratorCard 
          onOpenChange={onOpenChange4} 
          title="Surat Tugas (ST) Kegiatan" 
          imageUrl="/surat-tugas-diklat.png" 
        />

        <GeneratorCard 
          onOpenChange={onOpenChange5} 
          title="Surat Izin Belajar" 
          imageUrl="/surat-SIB.png" 
        />

        <GeneratorCard 
          onOpenChange={onOpenChange6} 
          title="Surat SPMMJ" 
          imageUrl="/surat-SPMMJ.png" 
        />

        <GeneratorCard 
          onOpenChange={onOpenChange7} 
          title="Surat SPMT" 
          imageUrl="/surat-SPMT.png" 
        />

        <GeneratorCard
          onOpenChange={onOpenChange8}
          title="Surat SK Kegiatan"
          imageUrl="/surat-SKKegiatan.png"
        />
      </div>

      <SuratPlhModal employee={employee} isOpen={isOpen} onOpenChange={onOpenChange} />

      <SuratLAMPModal employee={employee} isOpen={isOpen2} onOpenChange={onOpenChange2} />

      <SuratTugasDiklatModal employee={employee} isOpen={isOpen3} onOpenChange={onOpenChange3} />

      <SuratTugasKegModal employee={employee} isOpen={isOpen4} onOpenChange={onOpenChange4} />

      <SuratIzinBelajarModal employee={employee} isOpen={isOpen5} onOpenChange={onOpenChange5} />

      <SuratSPMMJModal employee={employee} isOpen={isOpen6} onOpenChange={onOpenChange6} />

      <SuratSPMTModal employee={employee} isOpen={isOpen7} onOpenChange={onOpenChange7} />

      <SuratSKKegiatanModal employee={employee} isOpen={isOpen8} onOpenChange={onOpenChange8} />
      
      <Toaster />
    </>
  )
}