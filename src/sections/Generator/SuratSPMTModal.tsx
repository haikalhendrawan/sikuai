import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue, Input,  
        Button, DatePicker, Avatar, Autocomplete, AutocompleteItem, Select, SelectItem} from "@nextui-org/react";
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
interface ValueType{
  nomorSurat: string,
  nomorND: string,
  penerbitSurat: string,
  selectPegawai: Key | null,
  jabatan: string,
  eselonIII: string,
  eselonIIIText: string,
  eselonIV: string,
  eselonIVText: string,
  selectAtasan: Key | null,
  startDate: DateValue | null,
  endDate: DateValue | null,
  tanggalSurat: DateValue | null, 
  tanggalSuratRujukan: DateValue | null
};

interface SuratSPMTModalTypes {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
};

const JABATAN_SELECTION = [
  {label: "Kepala Bidang", value: "1", text: 'Kepala'},
  {label: "Kepala Seksi", value: "2", text: 'Kepala'},
  {label: "Pelaksana", value: "3", text: 'Pelaksana'},
];


//-----------------------------------------------------------------------------------------------------------
export default function SuratSPMTModal({isOpen, onOpenChange, employee}: SuratSPMTModalTypes) {
  const [value, setValue] = useState<ValueType>({
    nomorSurat:"",
    nomorND: "",
    penerbitSurat: "",
    selectPegawai: "",
    jabatan: "",
    eselonIII: "",
    eselonIIIText: "",
    eselonIV: "",
    eselonIVText: "",
    selectAtasan: "",
    startDate: null,
    endDate: null,
    tanggalSurat: null,
    tanggalSuratRujukan: null 
  });

  const ESELONIII_SELECTION = (employee : EmployeeDataTypes[]): string[] => {
    const EselonIII = employee.filter(emp => emp.UnitEselonIII).map(emp => emp.UnitEselonIII);
    const uniqueEsIII = new Set(EselonIII);
    return [...uniqueEsIII];
  };
  
  const ESELONIV_SELECTION = (esIII: string, employee : EmployeeDataTypes[]): string[] => {
    const availableEselonIV = employee.filter(emp => emp.UnitEselonIII == esIII && emp.UnitEselonIV!==null);
    const eselonIV = availableEselonIV.map(emp => emp.UnitEselonIV);
    const uniqueEsIV = new Set(eselonIV);
    return [...uniqueEsIV];
  };

  const generateSPMT = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodeSPMT.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      doc.render({
        value: setData(value, employee)
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, `SPMT_${new Date().getTime()}.docx`);
    } catch(err: any) {
      console.error(err.message);
      toast.error(err.message, {
        position: 'top-right',
        className:'text-sm'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChangePegawai = (value: Key | null) => {
    setValue(prev => ({
      ...prev,
      selectPegawai: value
    }));
  };

  const handleSelectChangeAtasan = (value: Key | null) => {
    setValue(prev => ({
      ...prev,
      selectAtasan: value
    }));
  };

  const handleChangeJabatan = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(prev => ({
      ...prev,
      jabatan: e.target.value
    }));
  };

  const handleChangeEselonIII = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const eselonIIISelection = ESELONIII_SELECTION(employee);
    const selectedText = eselonIIISelection.find((_, i) => i === parseInt(selectedValue)) || '';
  
    setValue(prev => ({
      ...prev,
      eselonIII: selectedValue,
      eselonIIIText: selectedText
    }));
  };

  const handleChangeEselonIV = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const eselonIVSelection = ESELONIV_SELECTION(value.eselonIIIText, employee);
    const selectedText = eselonIVSelection.find((_, i) => i === parseInt(selectedValue)) || '';

    setValue(prev => ({
      ...prev,
      eselonIV: selectedValue,
      eselonIVText: selectedText
    }));
  };  

  const handleChangeStartDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      startDate: e
    }));
  };

  const handleChangeSuratRujukanDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      tanggalSuratRujukan: e
    }));
  };

  const handleChangeTanggalSurat = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      tanggalSurat: e
    }));
  };
  
  const handleReset = () => {
    setValue({
      nomorSurat:"",
      nomorND: "",
      penerbitSurat: "",
      selectPegawai: "",
      jabatan: "",
      eselonIII: "",
      eselonIIIText: "",
      eselonIV: "",
      eselonIVText: "",
      selectAtasan: "",
      startDate: null,
      endDate: null,
      tanggalSurat: null,
      tanggalSuratRujukan: null 
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

  const jabatanSelection = useMemo(() => 
    JABATAN_SELECTION.map((item: any) => (
      <SelectItem key={item.value}>
        {item.label}
      </SelectItem>
    )), 
    [employee]  
  );

  const eselonIIISelection = useMemo(() => 
    ESELONIII_SELECTION(employee).map((item: any, index: number) => (
      <SelectItem key={index}>
        {item}
      </SelectItem>
    )), 
    [employee]
  );

  const eselonIVSelection = useMemo(() =>
    ESELONIV_SELECTION(value.eselonIIIText, employee).map((item: any, index: number) => (
      <SelectItem key={index} textValue={item}>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <span className="text-small">{item}</span>
          </div>
        </div>
      </SelectItem>
    )),
    [value.eselonIIIText]
  );

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
              <ModalHeader className="flex flex-col gap-2">Surat Pernyataan Melaksanakan Tugas</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="nomorND"
                  label="Nomor Surat SPMT"
                  classNames={{
                    input: [
                      "w-3/12",
                    ],          
                    inputWrapper: [
                      "w-4/12"
                    ]
                  }}
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: SPMT-025/WPB.03/2024, SPMT-05/WPB.03/2024"
                  variant="bordered"
                  value={value.nomorND}
                  onChange={handleChange}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">SPMT-</span>
                    </div>
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center w-4/5">
                      <span className="text-default-400 text-small">/WPB.03/2024</span>
                    </div>
                  }
                />
                <DatePicker 
                  name="tanggalSurat"
                  label="Tanggal Surat SPMT"
                  variant="bordered"
                  value={value.tanggalSurat} 
                  className="max-w-xl"
                  labelPlacement="outside"
                  onChange={handleChangeTanggalSurat}
                  popoverProps={{placement: "right-end"}}
                />
                <Autocomplete
                  name="atasan"
                  label="Penandatangan (Kepala Kanwil)"
                  variant="bordered" 
                  className="max-w-xl"
                  size="md"
                  labelPlacement="outside"
                  placeholder="Pilih Kepala Kanwil atau yang mewakili"
                  selectedKey={value.selectAtasan}
                  onSelectionChange={handleSelectChangeAtasan}
                >
                  {employeeSelection}
                </Autocomplete>
                <Autocomplete
                  name="pegawai"
                  label="Pegawai"
                  variant="bordered" 
                  className="max-w-xl"
                  size="md"
                  labelPlacement="outside"
                  placeholder="Ketik nama pegawai"
                  selectedKey={value.selectPegawai}
                  onSelectionChange={handleSelectChangePegawai}
                >
                  {employeeSelection}
                </Autocomplete>
                <Select
                  name="jabatan"
                  label="Jabatan Baru"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Pilih jenis"
                  value={value.jabatan}
                  onChange={handleChangeJabatan}
                >
                  {jabatanSelection}
                </Select>
                <Select
                  name="eselonIII"
                  label="Es III"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Pilih Es III"
                  value={value.eselonIII}
                  onChange={handleChangeEselonIII}
                  multiple={false}
                >
                  {eselonIIISelection}
                </Select>
                <Select
                  name="eselonIV"
                  label="Es IV"
                  variant="bordered" 
                  className={value.jabatan === "1" ? "hidden" : "max-w-xl"}
                  labelPlacement="outside"
                  placeholder="Pilih Es IV"
                  value={value.eselonIV}
                  onChange={handleChangeEselonIV}
                  multiple={false}
                >
                  {eselonIVSelection}
                </Select>
                <div className="grid grid-cols-2 gap-4 w-8/12">
                  <DatePicker 
                    name="startDate"
                    label="Tanggal Terhitung Mulai"
                    variant="bordered"
                    value={value.startDate} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeStartDate}
                    popoverProps={{placement: "right-end"}}
                  />
                </div>
                <Input
                  type="text"
                  name="nomorSurat"
                  label="Nomor SK"
                  placeholder=" "
                  labelPlacement="outside"
                  description="KEP-20/PB.1/2024"
                  variant="bordered"
                  className="max-w-xl"
                  value={value.nomorSurat}
                  onChange={handleChange}
                />
                  <DatePicker 
                  name="tanggalSuratRujukan"
                  label="Tanggal SK"
                  variant="bordered"
                  value={value.tanggalSuratRujukan} 
                  className="max-w-xl"
                  labelPlacement="outside"
                  onChange={handleChangeSuratRujukanDate}
                  popoverProps={{placement: "right-end"}}
                  />
                  <Input
                  type="text"
                  name="penerbitSurat"
                  label="Penerbit SK"
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Direktur Jenderal Perbendaharaan, Menteri Keuangan"
                  variant="bordered"
                  className="max-w-xl"
                  value={value.penerbitSurat}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={generateSPMT} 
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
  )
}
// -----------------------------------------------------------------------------------------------------
function formatDate(dateStr: string) {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const date = moment(dateStr, 'YYYY-MM-DD');
  const day = date.date();
  const month = monthNames[date.month()]; // month() returns 0-11
  const year = date.year();
  return `${day} ${month} ${year}`;
};

function getJabatanLengkap(employee: EmployeeDataTypes | undefined, value: ValueType) {
  if(!employee) {
    return ""
  };

  const isKPPN = value.eselonIIIText.split(" ")[0]==="KPPN"?null:' Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat';
  const eselon = value.jabatan;
  const eselonIII = getUnitKerja(value.eselonIIIText);
  const eselonIV = value.eselonIVText;

  if (eselon === "1") {
    return `Kepala ${eselonIII}`
  } 
  if (eselon === "2") {
    return `Kepala ${eselonIV} ${eselonIII}`
  }

  return `Pelaksana ${eselonIV} ${eselonIII}${isKPPN}`

}

function setData(value: ValueType, employee: EmployeeDataTypes[]) {
  const selectedEmployee = employee.find((item) => item.No == value.selectPegawai);
  const selectedAtasan = employee.find((item) => item.No == value.selectAtasan);
  const valueOutput = {
    nomorSurat: value.nomorSurat,
    tanggalSurat: formatDate(value.tanggalSurat?.toString() || ""),
    nomorND: value.nomorND,
    tanggalSuratRujukan: formatDate(value.tanggalSuratRujukan?.toString() || ""),
    penerbitSurat: value.penerbitSurat,
    tanggalMulai: formatDate(value.startDate?.toString() || ""),
    tanggalMasih: formatDate(value.endDate?.toString() || ""),
    pegawai: {
      ...selectedEmployee, 
      UnitEselonII: getUnitKerja(selectedEmployee?.UnitEselonII), 
      NIP: selectedEmployee?.NIP.slice(1),
      JabatanLengkap: getJabatanLengkap(selectedEmployee, value)
    },
    atasan: {
      ...selectedAtasan, 
      UnitEselonII: getUnitKerja(selectedAtasan?.UnitEselonII), 
      NIP: selectedAtasan?.NIP.slice(1)
    },
    year: new Date().getFullYear()
  }
  return valueOutput
};
