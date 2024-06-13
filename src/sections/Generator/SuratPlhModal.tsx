import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue,  
        Button, DatePicker, Avatar, Select, SelectItem, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {parseDate} from "@internationalized/date";
import { Key } from '@react-types/shared';
import { EmployeeDataTypes } from "./types";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import moment from "moment-timezone";
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
  const [callingAPI, setCallingAPI] = useState(false);

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
    unitKecil: asli.jabatan,
  });

  const generateDocument = () => {
    loadFile(
      `${import.meta.env.VITE_API_URL}/template/templateNodePlh.docx`,
      function (error: any, content: any) {
        if (error) {
          console.log(error)
          throw error
        };
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          parser: expressionParser,
        });
        doc.render({
          asli,
          pengganti, 
          info
        });
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); 
        saveAs(out, 'output.docx');
      }
    );
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
      sebutan: getSebutan((employee.length > 0 && v!==0)? employee.find((item) => item.No == v)?.Sex || "": ""),
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
    SELECT_ALASAN?.map((item, index) => (
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
                  isDisabled={callingAPI}
                >
                  Add
                </Button>
                <Button 
                  color="default" 
                  onClick={handleReset} 
                  isDisabled={callingAPI}
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
function loadFile(url: string, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
};

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
  if(sex.toLowerCase()==='p'){
    return "Sdri."
  }
  return "Sdr."
};

function getLamaWaktu(startDate: string, endDate: string) {
  const tanggalAwal = startDate.split(" ")[0];

  const tanggalAkhir = endDate.split(" ")[0];
  const bulanAkhir = endDate.split(" ")[1];

  const isTheSameMonth = moment(startDate, 'YYYY-MM-DD').isSame(moment(endDate, 'YYYY-MM-DD'), 'month');

  if(startDate === endDate){
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
  }

  return `, disamping melaksanakan tugas pokok sebagai ${jabatan}.`
};

function getUnitKerja(unit: string | undefined){
  if(!unit){
    return ""
  };
  
  return unit
  .replace("Kanwil DJPBN Prov. Sumatera Barat", "Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat")
  .replace("(A1)", "")
  .replace("(A2)", "")
  .replace("KPPN", "Kantor Pelayanan Perbendaharaan Negara")
};
