import {useState, useEffect} from "react";
import { Key } from '@react-types/shared';
import {Input, Image, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { EmployeeDataTypes, EmployeeFormTypes } from "./types";


interface EmployeeFormProps{
  employee: EmployeeDataTypes[] | []
};

export default function EmployeeForm({employee}: EmployeeFormProps) {
  const [value, setValue] = useState<number>(0);

  const [empForm, setEmpForm] = useState<EmployeeFormTypes>({
    no: 0,
    nama: "",
    nip: "",
    pangkatGol: "",
    gelarDepan: "",
    gelarBelakang: "",
    tempatLahir: "",
    tanggalLahir:"",
    email: "",
    hp: "",
    esIII: "",
    esIV: "",
    jabatan: "",
    pendidikan: "",
  });

  const [imageSrc, setImageSrc] = useState("/default-pp.jpg");

  const handleImageError = () => {
    setImageSrc("/default-pp.jpg");
  };

  const handleSelectChange = (v: Key) => {
    setValue(v as number);

    const selectedEmployee = (employee.length > 0 && value!==0)? employee.find((item) => item.No == v ) : null;
    const NIP = selectedEmployee ? selectedEmployee.NIP.slice(1) : null;
    setImageSrc(`https://sikuai.web.id/uploads/fpbn/${NIP}.jpg`);
  };

  useEffect(() => {
    if(value == 0){
      return setEmpForm((prev) => ({
        ...prev,
        no: 0,
        nama: "",
        nip: "",
        pangkatGol: "",
        gelarDepan: "",
        gelarBelakang: "",
        tempatLahir: "",
        tanggalLahir: "",
        email: "",
        hp: "",
        esIII: "",
        esIV: "",
        jabatan: "",
        pendidikan: "",
      }))
    }
    setEmpForm((prev) => ({
      ...prev,
      nama: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.Nama || "": "",
      nip: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.NIP || "": "",
      pangkatGol: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.Pangkat || "": "",
      gelarDepan: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.GelarDepan || "": "",
      gelarBelakang: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.GelarBelakang || "": "",
      tempatLahir: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.TempatLahir || "": "",
      tanggalLahir: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.TanggalLahir || "": "",
      hp: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.HP || "": "",
      email: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.Email || "" : "",
      esIII: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.UnitEselonIII || "": "",
      esIV: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.UnitEselonIV || "": "",
      jabatan: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.Jabatan || "": "",
      pendidikan: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.PendidikanTerakhir || "": "", 
    }));
  }, [employee, value])

  return(
    <>
      <div className="flex justify-center items-center gap-1">
        <div className="flex flex-col justify-center items-center w-2/5">
          <Image
            width={300}
            height={300}
            src={imageSrc}
            className="mx-auto rounded-3xl w-[300px] h-[400px] object-cover"
            alt="profile pegawai"
            onError={handleImageError}
          />
          <p className="text-sm text-slate-500 pt-4">{empForm.email}</p>
          <p className="text-sm text-slate-500">{empForm.hp.slice(1)}</p>
          <p className="text-sm text-slate-500 pt-4">{`TTL: ${empForm.tempatLahir}, ${empForm.tanggalLahir.slice(1)}`}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-3/5">
          <Autocomplete
            name='nama'
            label="Ketik nama pegawai disini"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            defaultItems={employee}
            labelPlacement="outside"
            selectedKey={value}
            onSelectionChange={handleSelectChange}
            placeholder="Nama"
            isInvalid={value===0}
          >
            {(user) => (
              <AutocompleteItem key={user.No} textValue={user.Nama}>
                {user.Nama}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Input
            name='esIII'
            label="Bidang/Bagian/KPPN"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.esIII || ""}
            labelPlacement="outside"
          />
          <Input
            name='nip'
            label="NIP"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.nip.slice(1) || ""}
            labelPlacement="outside"
          />
          <Input
            name='esIV'
            label="Seksi"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.esIV || ""}
            labelPlacement="outside"
          />
          <Input
            name='pangkatGol'
            label="Pangkat/Gol"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.pangkatGol || ""}
            labelPlacement="outside"
          />
          <Input
            name='jabatan'
            label="Jabatan"
            size="lg"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.jabatan || ""}
            labelPlacement="outside"
          />
          <div className="grid grid-col-2 grid-flow-col gap-4">
            <Input
              name='gelarDepan'
              label="Gelar Depan"
              size="lg"
              variant="bordered"
              className="px-2"
              value={empForm.gelarDepan || ""}
              labelPlacement="outside"
            />
            <Input
              name='gelarBelakang'
              label="Gelar Belakang"
              size="lg"
              variant="bordered"
              className=" px-2"
              value={empForm.gelarBelakang || ""}
              labelPlacement="outside"
            />
          </div>
          <Input
              name='pendidikan'
              label="Pendidikan"
              size="lg"
              variant="bordered"
              className="max-w-xl px-2"
              value={empForm.pendidikan || ""}
              labelPlacement="outside"
          />
        </div>
      </div>

    </>
  )
}