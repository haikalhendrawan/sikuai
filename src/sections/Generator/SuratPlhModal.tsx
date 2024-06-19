import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue,  
        Button, DatePicker, Avatar, Select, SelectItem, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { Key } from '@react-types/shared';
import { EmployeeDataTypes } from "./types";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import moment from "moment-timezone";
import { loadFilePromise, getUnitKerja } from "./utils";
import toast from 'react-hot-toast';
//-----------------------------------------------------------------------------------------------------------
interface SuratPlhModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
};

const SELECT_ALASAN = [
  {label: "Cuti Tahunan", value: "1", text: 'melaksanakan cuti tahunan'},
  {label: "Cuti Sakit", value: "2", text: 'melaksanakan cuti sakit'},
  {label: "Dinas Luar", value: "3", text: 'melaksanakan penugasan'},
  {label: "Cuti Besar", value: "4", text: 'melaksanakan cuti besar'},
  {label: "Cuti Karena Alasan Penting", value: "5", text: 'melaksanakan cuti karena alasan penting'},
  {label: "Cuti Melahirkan", value: "6", text: 'cuti melahirkan'},
];

interface ValueType{
  selectAsli: number,
  selectAlasan: string,
  startDate: DateValue | null,
  endDate: DateValue | null,
  selectPengganti: number
};


//-----------------------------------------------------------------------------------------------------------
export default function SuratPlhModal({isOpen, onOpenChange, employee}: SuratPlhModalProps) {
  const [value, setValue] = useState<ValueType>({
    selectAsli: 0,
    selectAlasan: '0',
    startDate: null, 
    endDate: null,
    selectPengganti: 0,
  });

  const [asli, setAsli] = useState({
    nama: '',
    nip: '',
    jabatan: '',
    unitKerja: '',
  });

  const [pengganti, setPengganti] = useState({
    nama: '',
    nip: '',
    pangkat: '',
    gol: '',
    jabatan: '',
  });

  const [info, setInfo] = useState({
    sebutan: '',
    alasan: '',  
    tanggalMulai: '',
    tanggalSelesai: '',
    lamaWaktu: '',
    ending: '',
    year: new Date().getFullYear(),
  });

  const generateDocument = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodePlh.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      doc.render({
        asli,
        pengganti,
        info,
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, 'output.docx');
    } catch(err: any) {
      console.error(err.message);
      toast.error(JSON.stringify(err.message), {
        position: 'top-right',
        className:'text-sm'
      });
    }
  };

  const handleSelectChangeAsli = (v: Key | null) => {
    setValue(prev => ({
      ...prev,
      selectAsli: v as number
    }));

    setAsli(prev => ({
      ...prev,
      nama: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Nama || "": "",
      nip: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.NIP.slice(1) || "": "",
      jabatan: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Jabatan || "": "",
      unitKerja: (employee.length > 0 && v!==0)? getUnitKerja(employee.find((item) => item.No == v)?.UnitKerja) || "": "",
    }));

    setInfo(prev => ({
      ...prev,
      sebutan: getSebutan((employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Sex || "": ""),
    }))
  };

  const handleChangeAlasan = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(prev => ({
      ...prev,
      selectAlasan: e.target.value
    }));

    setInfo(prev => ({
      ...prev,
      alasan: getAlasan(e.target.value) || ''
    }))
  };

  const handleChangeStartDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      startDate: e
    }));

    setInfo(prev => ({
      ...prev,
      tanggalMulai: formatDate(e?.toString() || new Date().toISOString().split('T')[0]),
    }))
  };

  const handleChangeEndDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      endDate: e
    }));

    setInfo(prev => ({
      ...prev,
      tanggalSelesai: formatDate(e?.toString() || new Date().toISOString().split('T')[0]),
      lamaWaktu: getLamaWaktu(info.tanggalMulai, formatDate(e?.toString() || new Date().toISOString().split('T')[0])) || '',
    }));

  };

  const handleSelectChangePengganti= (v: Key | null) => {
    setValue(prev => ({
      ...prev,
      selectPengganti: v as number
    }));

    setPengganti(prev => ({
      ...prev,
      nama: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Nama || "": "",
      nip: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.NIP.slice(1) || "": "",
      pangkat: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Pangkat || "": "",
      gol: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Gol || "": "",
      jabatan: (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Jabatan || "": "",
    }));

    setInfo(prev => ({
      ...prev,
      ending: getEnding((employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Eselon || "": "", (employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Jabatan || "": ""),
    }))
  };


  // const handleChange = (e: (React.ChangeEvent<HTMLInputElement>) | (DateValue) | React.ChangeEvent<HTMLSelectElement>	 ) => {
  //   if ('target' in e) {
  //     setValue((prev) => ({...prev, [e.target.name]: e.target.value}));
  //   }else{
  //     setValue((prev) => ({...prev, date: e}));
  //   }
  // };


  const handleReset = () => {
    setValue({
      selectAsli: 0,
      selectAlasan: '0',
      startDate: null, 
      endDate: null,
      selectPengganti: 0,
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
    SELECT_ALASAN?.map((item) => (
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
              <ModalHeader className="flex flex-col gap-2">Surat Perintah Plh/Plt</ModalHeader>
              <ModalBody>
                <Autocomplete
                  name="asli"
                  label="Pejabat Asli"
                  variant="bordered" 
                  className="max-w-xl"
                  size="md"
                  labelPlacement="outside"
                  placeholder="Ketik nama pegawai"
                  selectedKey={value.selectAsli}
                  // value={value.uic}
                  onSelectionChange={handleSelectChangeAsli}
                >
                  {employeeSelection}
                </Autocomplete>
                <Select
                  name="alasan"
                  label="Alasan"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Pilih alasan"
                  selectedKeys={value.selectAlasan}
                  // value={value.uic}
                  onChange={handleChangeAlasan}
                >
                  {alasanSelection}
                </Select>
                <div className="grid grid-cols-2 gap-4 w-8/12">
                  <DatePicker 
                    name="startDate"
                    label="Tanggal Mulai"
                    variant="bordered"
                    value={value.startDate} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeStartDate}
                    popoverProps={{placement: "right-end"}}
                  />
                  <DatePicker 
                    name="endDate"
                    label="Tanggal Selesai"
                    variant="bordered"
                    value={value.endDate} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeEndDate}
                    popoverProps={{placement: "right-end"}}
                  />
                </div>
                <Autocomplete
                  name="pengganti"
                  label="Pejabat/Pegawai Pengganti"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Ketik nama pegawai"
                  selectedKey={value.selectPengganti}
                  // value={value.uic}
                  onSelectionChange={handleSelectChangePengganti}
                >
                  {employeeSelection}
                </Autocomplete>  
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
            </>
          )}
        </ModalContent>

      </Modal>
    </>
  );
}

// -----------------------------------------------------------------------------------------------------
function getAlasan(value: string) {
  // const alasan = [
  //   {label: "Cuti Tahunan", value: "1", text: 'melaksanakan cuti tahunan'},
  //   {label: "Cuti Sakit", value: "2", text: 'melaksanakan cuti sakit'},
  //   {label: "Dinas Luar", value: "3", text: 'melaksanakan penugasan'},
  // ]
  return SELECT_ALASAN?.find((item) => item.value === value)?.text;
};

function formatDate(dateStr: string) {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const date = moment(dateStr, 'YYYY-MM-DD');
  const day = date.date();
  const month = monthNames[date.month()]; // month() returns 0-11
  return `${day} ${month}`;
};

function getSebutan(sex: string) {
  console.log(sex)
  if(sex.toLowerCase()==='p'){
    return "Sdri."
  };
  return "Sdr."
};

function getLamaWaktu(startDate: string, endDate: string) {
  const tanggalAwal = startDate.split(" ")[0];
  const bulanAwal = startDate.split(" ")[1];

  const tanggalAkhir = endDate.split(" ")[0];
  const bulanAkhir = endDate.split(" ")[1];

  const isTheSameDate = tanggalAwal === tanggalAkhir;
  const isTheSameMonth = bulanAwal === bulanAkhir;

  if(isTheSameDate){
    return `${startDate} ${new Date().getFullYear()}`
  };

  if(isTheSameMonth){
    return `${tanggalAwal} s.d. ${tanggalAkhir} ${bulanAkhir} ${new Date().getFullYear()}`
  };


  return `${startDate} s.d. ${endDate} ${new Date().getFullYear()}`
};

function getEnding(eselon: string, jabatan: string){
  if(eselon.toLowerCase() === 'pelaksana'){
    return "."
  };

  return `, disamping melaksanakan tugas pokok sebagai ${jabatan}.`
};
