import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue, Switch,  
        Button, DatePicker, Avatar, Select, SelectItem, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { Key } from '@react-types/shared';
import { EmployeeDataTypes } from "./types";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import moment from "moment-timezone";
import { loadFilePromise, getUnitKerja } from "./utils";
//-----------------------------------------------------------------------------------------------------------

const SELECT_JENIS = [
  {label: "Lupa Absen Masuk", value: "1", text: 'masuk'},
  {label: "Lupa Absen Pulang", value: "2", text: 'pulang'},
  {label: "Lupa Absen Masuk dan Pulang", value: "3", text: 'masuk dan pulang'},
];

interface ValueType{
  selectPegawai: number,
  selectJenis: string,
  date: DateValue | null,
  selectAtasan: number
};

interface SuratLAMPModalTypes {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
};
//-----------------------------------------------------------------------------------------------------------
export default function SuratLAMPModal({isOpen, onOpenChange, employee}: SuratLAMPModalTypes) {
  const [errorText, setErrorText] = useState<string>('');

  const [value, setValue] = useState<ValueType>({
    selectPegawai: 0,
    selectJenis: '0',
    date: null, 
    selectAtasan: 0,
  });

  const [pegawai, setPegawai] = useState({
    nama: '',
    nip: '',
    pangkat: '',
    gol: '',
    jabatan: '',
    unitKerja: '',
  });

  const [atasan, setAtasan] = useState({
    nama: '',
    nip: '',
    pangkat: '',
    gol: '',
    jabatan: '',
  });

  const [info, setInfo] = useState({
    isLAM: false,
    isLAP: false,
    isLAMP: false,
    isTTE: false,
    isPlh: false,
    year: new Date().getFullYear(),
  });

  const handleChangeTTE = () => {
    setInfo(prev => ({
      ...prev,
      isTTE: !prev.isTTE
    }));
  };

  const handleChangePlh = () => {
    setInfo(prev => ({
      ...prev,
      isPlh: !prev.isPlh
    }));
  };

  const generateDocument = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodeLAMP.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      doc.render({
        pegawai,
        atasan,
        info,
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, 'output.docx');
    } catch(err: any) {
      console.error(err.message);
      setErrorText(err.message);
    }
  };

  const handleChangeJenis= (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(prev => ({
      ...prev,
      selectJenis: e.target.value
    }));

    setInfo(prev => ({
      ...prev,
      isLAM: e.target.value == '1',
      isLAP: e.target.value == '2',
      isLAMP: e.target.value == '3',
    }))
  };

  const handleSelectChangePegawai = (v: Key | null) => {
    setValue(prev => ({
      ...prev,
      selectPegawai: v as number
    }));

    setPegawai(prev => ({
      ...prev,
      nama: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Nama || "": "",
      nip: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.NIP.slice(1) || "": "",
      pangkat: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Pangkat || "": "",
      gol: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Gol || "": "",
      jabatan: getJabatan(employee, v),
      unitKerja: (employee.length > 0 && v!==0)? getUnitKerja(employee.find((item) => item.No == v)?.UnitKerja) || "": "",
    }));
  };

  const handleSelectChangeAtasan= (v: Key | null) => {
    setValue(prev => ({
      ...prev,
      selectAtasan: v as number
    }));

    setAtasan(prev => ({
      ...prev,
      nama: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Nama || "": "",
      nip: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.NIP.slice(1) || "": "",
      pangkat: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Pangkat || "": "",
      gol: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Gol || "": "",
      jabatan: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Jabatan || "": "",
    }));

  };

  const handleChangeDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      date: e
    }));

    setInfo(prev => ({
      ...prev,
      date: formatDate(e?.toString() || new Date().toISOString().split('T')[0])
    }))
  };
  
  const handleReset = () => {
    setValue({
      selectPegawai: 0,
      selectJenis: '0',
      date: null, 
      selectAtasan: 0,
    })
  };

  const employeeSelection = useMemo(() => 
    employee?.map((user: EmployeeDataTypes) => (
      <AutocompleteItem key={user.No} textValue={user.Nama}>
        <div className="flex gap-2 items-center">
          <Avatar alt={user.Nama} className="flex-shrink-0" size="sm" src={`https://sikuai.web.id/uploads/fpbn/${user.NIP.slice(1)}.jpg`} />
          <div className="flex flex-col">
            <span className="text-small">{user.Nama}</span>
            <span className="text-tiny text-default-400">{user.NIP.slice(1)}</span>
          </div>
        </div>
      </AutocompleteItem>
    )), 
    [employee]
  );

  const alasanSelection = useMemo(() => 
    SELECT_JENIS?.map((item) => (
      <SelectItem key={item.value}>
        {item.label}
      </SelectItem>
    )), 
    [employee]
  );

  return (
  <>
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size="4xl"
        className="p-4"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-2">Surat Lupa Absen</ModalHeader>
              <ModalBody>
                <Autocomplete
                  name="pegawai"
                  label="Pegawai"
                  variant="bordered" 
                  className="max-w-xl"
                  size="md"
                  labelPlacement="outside"
                  placeholder="Ketik nama pegawai"
                  selectedKey={value.selectPegawai}
                  // value={value.uic}
                  onSelectionChange={handleSelectChangePegawai}
                >
                  {employeeSelection}
                </Autocomplete>
                <div className="grid grid-cols-2 gap-4 w-8/12">
                  <DatePicker 
                    name="startDate"
                    label="Tanggal Lupa Absen"
                    variant="bordered"
                    value={value.date} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeDate}
                    popoverProps={{placement: "right-end"}}
                  />
                </div>
                <Select
                  name="alasan"
                  label="Jenis"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Pilih jenis"
                  selectedKeys={value.selectJenis}
                  // value={value.uic}
                  onChange={handleChangeJenis}
                >
                  {alasanSelection}
                </Select>
                <Autocomplete
                  name="atasan"
                  label="Atasan"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Ketik nama atasan"
                  selectedKey={value.selectAtasan}
                  // value={value.uic}
                  onSelectionChange={handleSelectChangeAtasan}
                >
                  {employeeSelection}
                </Autocomplete>
                <div className="grid grid-cols-2 gap-4 w-8/12">
                  <Switch name='isTTE' size="sm" isSelected={info.isTTE} onChange={handleChangeTTE}>
                    TTE?
                  </Switch>
                  <Switch name='isPlh' size="sm" isSelected={info.isPlh} onChange={handleChangePlh}>
                    Plh?
                  </Switch>
                </div>  

              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={generateDocument} 
                >
                  Generate
                </Button>
                <Button 
                  color="default" 
                  onClick={handleReset} 
                >
                  Reset
                </Button>
              </ModalFooter>
              <p>{errorText}</p>
            </>
          )}
        </ModalContent>

      </Modal>
    </>
  )
}
// -----------------------------------------------------------------------------------------------------
function getJenis(value: string) {
  return SELECT_JENIS?.find((item) => item.value === value)?.text;
};

function formatDate(dateStr: string) {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const date = moment(dateStr, 'YYYY-MM-DD');
  const day = date.date();
  const dayName = dayNames[date.day()]; // day() returns 0-6
  const month = monthNames[date.month()]; // month() returns 0-11
  return `${dayName}, ${day} ${month}`;
};

function getJabatan(emp: EmployeeDataTypes[], v: Key | null): string {
  if(emp.length< 0 || v===0) return "";

  const isPelaksana = emp.find((item) => item.No == v)?.Eselon.toLowerCase()==='pelaksana';

  if(!isPelaksana){
    return emp.find((item) => item.No == v)?.Jabatan || "" ;
  }

  return "Pelaksana"
}
