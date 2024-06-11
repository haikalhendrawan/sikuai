import {useState, useEffect} from "react";
import {Input, Button, Select, SelectItem, Image, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import AttendanceReport from "../PDF/AttendanceReport";
import axiosAuth from "../../config/axios";

interface EmployeeFormTypes{
  no: number,
  nama: string,
  nip: string,
  pangkatGol: string,
  gelarDepan: string,
  gelarBelakang: string,
  email: string,
  hp: string,
  esIII: string,
  esIV: string,
  jabatan: string,
  pendidikan: string
};
const animals = [
  {label: "Cat", value: "cat", description: "The second most popular pet in the world"},
  {label: "Dog", value: "dog", description: "The most popular pet in the world"},
  {label: "Elephant", value: "elephant", description: "The largest land animal"},
  {label: "Lion", value: "lion", description: "The king of the jungle"},
  {label: "Tiger", value: "tiger", description: "The largest cat species"},
  {label: "Giraffe", value: "giraffe", description: "The tallest land animal"},
  {
    label: "Dolphin",
    value: "dolphin",
    description: "A widely distributed and diverse group of aquatic mammals",
  },
  {label: "Penguin", value: "penguin", description: "A group of aquatic flightless birds"},
  {label: "Zebra", value: "zebra", description: "A several species of African equids"},
  {
    label: "Shark",
    value: "shark",
    description: "A group of elasmobranch fish characterized by a cartilaginous skeleton",
  },
  {
    label: "Whale",
    value: "whale",
    description: "Diverse group of fully aquatic placental marine mammals",
  },
  {label: "Otter", value: "otter", description: "A carnivorous mammal in the subfamily Lutrinae"},
  {label: "Crocodile", value: "crocodile", description: "A large semiaquatic reptile"},
];


export default function EmployeeForm(){
  const [value, setValue] = useState<EmployeeFormTypes>({
    no: 0,
    nama: '',
    nip: '199904082021011001',
    pangkatGol: '',
    gelarDepan: '',
    gelarBelakang: '',
    email: '',
    hp: '',
    esIII: '',
    esIV: '',
    jabatan: '',
    pendidikan: ''
  });

  const handleChange = (e: (React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>)) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setImageSrc(`https://sikuai.web.id/uploads/fpbn/${e.target.value}.jpg`)
  };

  const [imageSrc, setImageSrc] = useState(`https://sikuai.web.id/uploads/fpbn/${value.nip}.jpg`)

  const handleImageError = () => {
    setImageSrc("/default-pp.jpg");
  };

  return(
    <>
      <div className="flex justify-center items-center gap-1">
        <div className="flex flex-col justify-center items-center w-2/5">
          <Image
            width={250}
            src={imageSrc}
            className="mx-auto rounded-3xl" 
            alt='profile pegawai'
            onError={handleImageError}
          />
          <p className="text-sm text-slate-500 pt-4">haikal.hendrawan@kemenkeu.go.id</p>
          <p className="text-sm text-slate-500">081291249590</p>
          <p className="text-sm text-slate-500 pt-4">Tempat Tgl Lahir: Jakarta, 8 April 1999</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-3/5">
          <Autocomplete
            name='nama'
            label="Nama"
            size="lg"
            isRequired  
            variant="bordered"
            className="max-w-xl px-2"
            defaultItems={animals}
            labelPlacement="outside"
            selectedKey={value.nama}
            onChange={handleChange}
            description={'Ketik nama pegawai disini'}
          >
            {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
          </Autocomplete>
          <Input
            name='esIII'
            label="Bidang/Bagian/KPPN"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={value.nama}
            labelPlacement="outside"
            onChange={handleChange}
          />
          <Input
            name='nip'
            label="NIP"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={value.nama}
            labelPlacement="outside"
            onChange={handleChange}
          />
          <Input
            name='esIV'
            label="Seksi"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={value.nama}
            labelPlacement="outside"
            onChange={handleChange}
          />
          <Input
            name='pangkatGol'
            label="Pangkat/Gol"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={value.nama}
            labelPlacement="outside"
            onChange={handleChange}
          />
          <Input
            name='jabatan'
            label="Jabatan"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={value.nama}
            labelPlacement="outside"
            onChange={handleChange}
          />
          <div className="grid grid-col-2 grid-flow-col gap-4">
            <Input
              name='gelarDepan'
              label="Gelar Depan"
              size="lg"
              variant="bordered"
              className="px-2"
              value={value.nama}
              labelPlacement="outside"
              onChange={handleChange}
            />
            <Input
              name='gelarBelakang'
              label="Gelar Belakang"
              size="lg"
              variant="bordered"
              className=" px-2"
              value={value.nama}
              labelPlacement="outside"
              onChange={handleChange}
            />
          </div>
          <Input
              name='pendidikan'
              label="Pendidikan"
              size="lg"
              variant="bordered"
              className="max-w-xl px-2"
              value={value.nama}
              labelPlacement="outside"
              onChange={handleChange}
          />
        </div>
      </div>

    </>
  )
}