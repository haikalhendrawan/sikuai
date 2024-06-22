import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue, Input,  
        Button, DatePicker, Avatar, Autocomplete, AutocompleteItem} from "@nextui-org/react";
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
  selectPegawai: Key | null,
  jurusan: string,
  universitas: string,
  startDate: DateValue | null,
  endDate: DateValue | null,
  tanggalSurat: DateValue | null, 
};

interface SuratIzinBelajarModalTypes {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
};
//-----------------------------------------------------------------------------------------------------------
export default function SuratIzinBelajarModal({isOpen, onOpenChange, employee}: SuratIzinBelajarModalTypes) {
  const [value, setValue] = useState<ValueType>({
    nomorSurat:"",
    selectPegawai: "",
    jurusan: "",
    universitas: "",
    startDate: null,
    endDate: null,
    tanggalSurat: null, 
  });

  const generateSIB = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodeSIB.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      doc.render({
        value: setData(value, employee)
      });
      
      console.log(setData(value, employee))
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, `izinBelajar_${new Date().getTime()}.docx`);
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

  const handleChangeStartDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      startDate: e
    }));
  };

  const handleChangeEndDate = (e: DateValue) => {
    setValue(prev => ({
      ...prev,
      endDate: e
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
      selectPegawai: "",
      jurusan: "",
      universitas: "",
      startDate: null,
      endDate: null,
      tanggalSurat: null, 
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
              <ModalHeader className="flex flex-col gap-2">Surat Izin Belajar</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="nomorSurat"
                  label="Nomor Surat"
                  classNames={{
                    input: [
                      "w-3/12",
                    ],          
                    inputWrapper: [
                      "w-3/12"
                    ]
                  }}
                  placeholder=" "
                  labelPlacement="outside"
                  description="SI-25/WPB.03/2024  "
                  variant="bordered"
                  value={value.nomorSurat}
                  onChange={handleChange}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">SI-</span>
                    </div>
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center w-4/5">
                      <span className="text-default-400 text-small">/WPB.03/2024</span>
                    </div>
                  }
                />
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
                <div className="grid grid-cols-2 gap-4 w-8/12">
                  <DatePicker 
                    name="startDate"
                    label="Mulai"
                    variant="bordered"
                    value={value.startDate} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeStartDate}
                    popoverProps={{placement: "right-end"}}
                  />
                  <DatePicker 
                    name="endDate"
                    label="Selesai"
                    variant="bordered"
                    value={value.endDate} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeEndDate}
                    popoverProps={{placement: "right-end"}}
                  />
                </div>
                <Input
                  type="text"
                  name="jurusan"
                  label="Jurusan"
                  className={"max-w-xl"}
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Manajemen, Akuntansi"
                  variant="bordered"
                  value={value.jurusan}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="universitas"
                  label="Universitas"
                  className={"max-w-xl"}
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Universitas Terbuka"
                  variant="bordered"
                  value={value.universitas}
                  onChange={handleChange}
                />
                <DatePicker 
                    name="tanggalSurat"
                    label="Tanggal Surat"
                    variant="bordered"
                    value={value.tanggalSurat} 
                    className="max-w-xl"
                    labelPlacement="outside"
                    onChange={handleChangeTanggalSurat}
                    popoverProps={{placement: "right-end"}}
                  />
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={generateSIB} 
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

function getLamaWaktu(startDate: string, endDate: string) {
  const bulanAwal = startDate.split(" ")[1];
  const tahunAwal = startDate.split(" ")[2];

  const bulanAkhir = endDate.split(" ")[1];
  const tahunAkhir = endDate.split(" ")[2];

  return `${bulanAwal} ${tahunAwal} s.d. ${bulanAkhir} ${tahunAkhir}`
};

function setData(value: ValueType, employee: EmployeeDataTypes[]) {
  const selectedEmployee = employee.find((item) => item.No == value.selectPegawai);
  return {
    nomorSurat: value.nomorSurat,
    pegawai: {
      ...selectedEmployee, 
      UnitEselonII: getUnitKerja(selectedEmployee?.UnitEselonII), 
      NIP: selectedEmployee?.NIP.slice(1)
    },
    jurusan: value.jurusan,
    universitas: value.universitas,
    tanggal: getLamaWaktu(formatDate(value.startDate?.toString() || ""), formatDate(value.endDate?.toString() || "")),
    tanggalSurat: formatDate(value.tanggalSurat?.toString() || "")
  }
};
