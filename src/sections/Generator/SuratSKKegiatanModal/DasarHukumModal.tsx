import {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,  Input,
        Button} from "@nextui-org/react";
import axiosAuth from "../../../config/axios";
import toast from 'react-hot-toast';

interface DasarHukumModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
};

export default function DasarHukumModal({isOpen, onOpenChange}: DasarHukumModalProps){
  const [value, setValue] = useState({
    nomor: '',
    jenis: '',
    singkatan: '',
    judul: '',
  });

  const handleChange = (e: (React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>)) => {
    setValue({...value, [e.target.name]: e.target.value});
  };

  const handleReset = () => {
    setValue({
      nomor: '',
      jenis: '',
      singkatan: '',
      judul: '',
    })
  };

  const handleClick = async() => {
    try{
      const response = await axiosAuth.post("/addDasarHukum", value);
      handleReset();
      toast.success(response.data.message, {
        position: 'top-right',
        className:'text-sm'
      });
      onOpenChange();
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
  };


  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size="4xl"
        className="p-4"
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-2">Tambah Dasar Hukum</ModalHeader>
              <ModalBody>
                <Input
                  type= "text"
                  name= "jenis"
                  variant= "bordered"
                  className= "max-w-wl"
                  value={value.jenis}
                  onChange={handleChange}
                  labelPlacement= "outside"
                  label= "Jenis Dasar Hukum"
                  placeholder= "Tulis jenis dasar hukum"
                  description= "Tulis lengkap, cth: Undang-Undang, Peraturan Pemerintah, Peraturan Menteri Keuangan, Peraturan Daerah Provinsi Sumatera Barat"
                />
                <Input
                  type= "text"
                  name= "singkatan"
                  variant= "bordered"
                  className= "max-w-wl"
                  value={value.singkatan}
                  onChange={handleChange}
                  labelPlacement= "outside"
                  label="Singkatan"
                  placeholder= "Tulis singkatan"
                  description= "cth: UU, PP, KMK, PMK, Perda"
                />
                <Input
                  type= "text"
                  name= "nomor"
                  variant= "bordered"
                  className= "max-w-wl"
                  value={value.nomor}
                  onChange={handleChange}
                  labelPlacement= "outside"
                  label= "Nomor Dasar Hukum"
                  placeholder= "Tulis nomor dan tahun"
                  description= "cth: 17 Tahun 2003, 1 Tahun 2004, 15 Tahun 2004"
                />
                <Input
                  type= "text"
                  name= "judul"
                  variant= "bordered"
                  value={value.judul}
                  onChange={handleChange}
                  className= "max-w-wl"
                  labelPlacement= "outside"
                  label="Tentang"
                  placeholder= "Tulis judul dasar hukum"
                  description= "cth: Pengelolaan Keungan Negara, Perbendaharaan Negara, Pemeriksaan Pengelolaan dan Tanggungjawab Keuangan Negara"
                />
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={handleClick}
                >
                  Add
                </Button>
                <Button 
                  color="default" 
                  onClick={handleReset} 
                >
                  Reset
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};