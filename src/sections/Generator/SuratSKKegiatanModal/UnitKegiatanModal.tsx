import {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Switch, Chip, Button} from "@nextui-org/react";
import axiosAuth from "../../../config/axios";
import toast from 'react-hot-toast';
import Iconify from "../../../components/Iconify";

interface UnitKegiatanModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
};

interface ValueType{
  nama: string,
  tusi: string[],
  ketuaTusi: string,
  noMember: boolean
};

export default function UnitKegiatanModal({isOpen, onOpenChange}: UnitKegiatanModalProps){
  const [value, setValue] = useState<ValueType>({
    nama: '',
    tusi: [],
    ketuaTusi: '',
    noMember: false
  });

  const [tusiValue, setTusiValue] = useState<string>('');

  const handleChange = (e: (React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>)) => {
    setValue({...value, [e.target.name]: e.target.value});
  };

  const handleAddTusi = () => {
    setValue(prev => ({
      ...prev,
      tusi: [...prev.tusi, tusiValue]
    }));
    setTusiValue('');
  };

  const handleDeleteTusi = (index: number) => {
    const newTusi = [...value.tusi];
    newTusi.splice(index, 1);
    setValue(prev => ({ ...prev, tusi: newTusi }));
  }

  const handleReset = () => {
    setValue({
      nama: '',
      tusi: [],
      ketuaTusi: '',
      noMember: false
    })
  };

  const handleClick = async() => {
    try{
      const response = await axiosAuth.post("/addUnitAcara", {
        ...value,
        noMember: value.noMember ? 1 : 0
      });
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
              <ModalHeader className="flex flex-col gap-2">Tambah Unit Panitia</ModalHeader>
              <ModalBody>
                <Input
                  type= "text"
                  name= "nama"
                  variant= "bordered"
                  className= "max-w-wl"
                  value={value.nama}
                  onChange={handleChange}
                  labelPlacement= "outside"
                  label= "Unit"
                  placeholder= "Tulis bidang/seksi acara"
                  description= "cth: Bidang Kehumasan, Bidang Acara, Seksi Sarana Prasarana, Ketua"
                />
                <Input
                  type= "text"
                  name= "ketuaTusi"
                  variant= "bordered"
                  className= "max-w-wl"
                  value={value.ketuaTusi}
                  onChange={handleChange}
                  labelPlacement= "outside"
                  label= "Tugas Ketua"
                  placeholder= "Tulis tugas ketua"
                  description= "cth: Memberikan arahan dan petunjuk kepada panitia penyelenggara,  guna mendukung kelancaran dan kesuksesan pelaksanaan kegiatan"
                />
                <div className="flex flex-row items-center gap-4">
                  <Input
                    type= "text"
                    name= "tusi"
                    variant= "bordered"
                    className= "max-w-lg"
                    value={tusiValue}
                    onChange={(e) => setTusiValue(e.target.value)}
                    labelPlacement= "outside"
                    label="Tugas Anggota"
                    placeholder= "Klik tombol tambah utk menambahkan lebih dari 1 tusi"
                    description= "cth: Menyusun dan keynotespeech Kepala Kantor Wilayah, Menyiapkan sarana dan prasarana"
                  />
                  <Button className="mb-4 bg-black text-white" isIconOnly onClick={handleAddTusi}>
                    <Iconify icon={"eva:plus-fill"}/>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-1 max-w-xl">
                  {value.tusi.map((item, index) => (
                    <Chip key={index} onClose={() => handleDeleteTusi(index)}>{`${index+1}. ${item}`}</Chip>
                  ))}
                </div>
                <Switch
                  name='noMember'
                  size="sm" 
                  checked={value.noMember} 
                  onChange={() => setValue({...value, noMember: !value.noMember})}
                >
                  Tidak ada anggota
                </Switch>
                <p className="text-xs text-default-500">Centang apabila unit tidak memiliki anggota, contoh: Ketua Acara</p>
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