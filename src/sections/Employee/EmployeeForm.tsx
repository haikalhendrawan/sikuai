import {useState, useEffect, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { Key } from '@react-types/shared';
import {Input, Image, Autocomplete, AutocompleteItem, Textarea, Button, Tooltip} from "@nextui-org/react";
import { EmployeeDataTypes, EmployeeFormTypes } from "./types";
import Iconify from "../../components/Iconify";
import moment from "moment";
import * as XLSX from "xlsx";


interface EmployeeFormProps{
  employee: EmployeeDataTypes[] | []
};

export default function EmployeeForm({employee}: EmployeeFormProps) {
  const navigate = useNavigate();

  const [value, setValue] = useState<number>(0);

  const [empForm, setEmpForm] = useState<EmployeeFormTypes>({
    no: 0,
    nama: "",
    nip: "",
    pangkat: "",
    gol:"",
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

  const [empty, setEmpty] = useState(true);

  const handleImageError = () => {
    setImageSrc("/default-pp.jpg");
  };

  const handleSelectChange = (v: Key | null) => {
    setValue(v as number);

    const NIP = (employee.length > 0 && v!==0)? employee.find((item) => item.No== v)?.NIP.slice(1) || "": ""
    setImageSrc(`https://sikuai.web.id/uploads/fpbn/${NIP}.jpg`);
    
    const isEmpty = v==null;
    setEmpty(isEmpty);
  };

  const employeeSelection = useMemo(() => 
    employee?.map((user: EmployeeDataTypes) => (
      <AutocompleteItem key={user.No} textValue={user.Nama}>
        {user.Nama}
      </AutocompleteItem>
    )), 
    [employee]
  );

  const tempatLahir = empForm.tempatLahir;

  const tanggalLahir = moment(new Date(empForm.tanggalLahir.slice(1))).format('D MMM YYYY');

  const ttlFooter = value?`${tempatLahir}, ${tanggalLahir}`:null

  const handleRedirect = () => {
    navigate("/inject")
  };

  const handlePrintExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(employee);
    const localDate = new Date().toLocaleDateString('en-GB');

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `Data_Pegawai_${localDate}.xlsx`);
  };

  useEffect(() => {
    if(value == 0){
      return setEmpForm((prev) => ({
        ...prev,
        no: 0,
        nama: "",
        nip: "",
        pangkat: "",
        gol: "",
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
      pangkat: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.Pangkat || "": "",
      gol: (employee.length > 0 && value!==0)? employee.find((item) => item.No == value )?.Gol || "": "",
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
  }, [employee, value]);

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
          <p className="text-sm text-slate-500 pt-4">
            {`TTL: `}{ttlFooter}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-3/5">
          <Autocomplete
            name='nama'
            label="Ketik nama pegawai disini"
            variant="bordered"
            className="max-w-xl px-2"
            defaultItems={employee}
            labelPlacement="outside"
            selectedKey={value}
            onSelectionChange={handleSelectChange}
            placeholder="Nama"
            isInvalid={empty}
          >
            {employeeSelection}
          </Autocomplete>
          <Textarea
            name='esIII'
            label="Bidang/Bagian/KPPN"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.esIII || " "}
            labelPlacement="outside"
            spellCheck={false}
            minRows={2}
          />
          <Input
            name='nip'
            label="NIP"
            variant="bordered"
            placeholder=" "
            className="max-w-xl px-2"
            spellCheck={false}
            value={empForm.nip.slice(1) || " "}
            labelPlacement="outside"
          />
          <Textarea
            name='esIV'
            label="Seksi"
            variant="bordered"
            className="max-w-xl px-2"
            spellCheck={false}
            value={empForm.esIV || " "}
            labelPlacement="outside"
            minRows={2}
          />
          <Input
            name='pangkatGol'
            label="Pangkat/Gol"
            variant="bordered"
            placeholder=" "
            className="max-w-xl px-2"
            spellCheck={false}
            value={`${empForm.pangkat} (${empForm.gol})` || " "}
            labelPlacement="outside"
          />
          <Textarea
            name='jabatan'
            label="Jabatan"
            variant="bordered"
            className="max-w-xl px-2"
            value={empForm.jabatan || " "}
            labelPlacement="outside"
            spellCheck={false}
            minRows={2}
          />
          <div className="grid grid-col-2 grid-flow-col gap-4">
            <Input
              name='gelarDepan'
              label="Gelar Depan"
              variant="bordered"
              placeholder=" "
              className="px-2"
              value={empForm.gelarDepan || ""}
              spellCheck={false}
              labelPlacement="outside"
            />
            <Input
              name='gelarBelakang'
              label="Gelar Belakang"
              variant="bordered"
              placeholder=" "
              className=" px-2"
              value={empForm.gelarBelakang || ""}
              spellCheck={false}
              labelPlacement="outside"
            />
          </div>
          <Input
              name='pendidikan'
              label="Pendidikan"
              variant="bordered"
              className="max-w-xl px-2"
              placeholder=" "
              value={empForm.pendidikan || ""}
              spellCheck={false}
              labelPlacement="outside"
          />
          <div className="flex flex-row gap-2">
            <Tooltip content="Cetak Excel Data Seluruh Pegawai" placement="right-end">
              <Button isIconOnly className="mt-5" onClick={handlePrintExcel}>
                <Iconify icon={"vscode-icons:file-type-excel"}/>
              </Button>
            </Tooltip>
            <Tooltip content="Update Data" placement="right-end">
              <Button isIconOnly className='bg-black text-white mt-5' onClick={handleRedirect}>
                <Iconify icon={"uiw:cloud-upload"}/>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  )
}