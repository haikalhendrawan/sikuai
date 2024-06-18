import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue, Input, Switch,
        Button, DatePicker, Avatar, Select, SelectItem, Autocomplete, AutocompleteItem, Chip,
        Textarea} from "@nextui-org/react";
import { Key } from '@react-types/shared';
import { EmployeeDataTypes } from "./types";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import moment from "moment-timezone";
import { loadFilePromise, getUnitKerjaShort } from "./utils";
import toast , {Toaster} from 'react-hot-toast';
expressionParser.filters.upper = function (input) {
  if (!input) return input;
  return input.toUpperCase();
};
//-----------------------------------------------------------------------------------------------------------
interface SuratTugasModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
};

const SELECT_PEMBEBANAN = [
  {label: "Kantor Pusat DJPb", value: "1", text: 'Kantor Pusat Direktorat Jenderal Perbendaharaan'},
  {label: "Kanwil DJPb Prov Sumbar", value: "2", text: 'Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat'},
  {label: "Lainnya", value: "3", text: 'lainnya'},
];

const SELECT_MEDIA = [
  {label: "KLC", value: "1", text: ` melalui https://klc2.kemenkeu.go.id,`},
  {label: "PJJ (Zoom/Ms Teams)", value: "2", text: ','},
  {label: "Blended (KLC + PJJ)", value: "3", text: ','},
];

interface ValueType{
  judulPelatihan: string,
  nomorND: string,
  pengirimND: string,
  judulND: string,
  startDate: DateValue | null,
  endDate: DateValue | null,
  media: string,
  kota: string,
  tempat: string,
  bebanDIPA: string,
  unitPembebanan: string,
  peserta: EmployeeDataTypes[] | []
};

//-----------------------------------------------------------------------------------------------------------
export default function SuratTugasModal({isOpen, onOpenChange, employee}: SuratTugasModalProps) {
  const [isDiklatOffline, setIsDiklatOffline] = useState<boolean>(false);

  const [pegawai, setPegawai] = useState<Key | null>(null);

  const [value, setValue] = useState<ValueType>({
    judulPelatihan: '',
    nomorND: '',
    pengirimND: '',
    judulND: '',
    startDate: null,
    endDate: null,
    media: '',
    kota: '',
    tempat: '',
    bebanDIPA: '',
    unitPembebanan: '',
    peserta: []
  });

  const generateDocument = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodeSTDiklat.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      doc.render({
        value: setData(isDiklatOffline, value)
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, 'output.docx');
    } catch(err: any) {
      console.error(JSON.stringify(err.message));
      toast.error(JSON.stringify(err.message), {
        position: 'top-right',
        className:'text-sm'
      });
    }
  };

  const generateLampiran = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/lampiranNodeSTDiklat.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      doc.render({
        value: setData(isDiklatOffline, value)
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, 'output.docx');
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
    setPegawai(value);

    if(value){
      const selected = employee.find((item) => item.No==value);
      if(selected){
        setValue((prev) => ({
          ...prev, 
          peserta: [...prev.peserta, {
            ...selected,
            index: prev.peserta.length+1, 
            NIP: selected.NIP.slice(1),
            Jabatan: getJabatan(employee, selected.No)
          }]}
        ));
      }
    };
  };

  const handleDeletePeserta = (value: number) => {
    setValue((prev) => ({
      ...prev, 
      peserta: prev.peserta.filter((item) => item.No != value
      )}  
    ));
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

  const handleReset = () => {
    setValue({
      judulPelatihan: '',
      nomorND: '',
      pengirimND: '',
      judulND: '',
      startDate: null,
      endDate: null,
      media: '',
      kota: '',
      tempat: '',
      bebanDIPA: '',
      unitPembebanan: '',
      peserta: []
    });

    setPegawai(null);
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

  const bebanDIPASelection = useMemo(() => 
    SELECT_PEMBEBANAN?.map((item) => (
      <SelectItem key={item.value}>
        {item.label}
      </SelectItem>
    )), 
    [employee]
  );

  const mediaSelection = useMemo(() =>
    SELECT_MEDIA?.map((item) => (
      <SelectItem key={item.value}>
        {item.label}
      </SelectItem>
    )),
    []
  )

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
              <ModalHeader className="flex flex-col gap-2">Surat Tugas Diklat</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="judulPelatihan"
                  label="Judul Pelatihan"
                  className="max-w-xl"
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: PJJ E-Learning Open Access Pusdiklat AP 2024"
                  variant="bordered"
                  value={value.judulPelatihan}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-3 gap-4 max-w-xl">
                  <Input
                    type="text"
                    name="nomorND"
                    label="Nomor ND rujukan"
                    placeholder=""
                    labelPlacement="outside"
                    description="Cth: ND-22/PB.1/2024"
                    variant="bordered"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">ND-</span>
                      </div>
                    }
                    className="col-span-1"
                    value={value.nomorND}
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    name="pengirimND"
                    label="Pengirim ND"
                    placeholder=" "
                    labelPlacement="outside"
                    description="Cth: Sekretaris Direktorat Jenderal Perbendaharaan"
                    variant="bordered"
                    className="col-span-2"
                    value={value.pengirimND}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  type="text"
                  name="judulND"
                  label="Judul ND Rujukan"
                  className="max-w-xl"
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Pemanggilan Peserta Pelatihan Jarak Jauh xxx"
                  variant="bordered"
                  value={value.judulND}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4 max-w-xl">
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
                <div className="grid grid-cols-2 gap-4 max-w-xl mt-2">
                  <Switch name='isTTE' size="sm" checked={isDiklatOffline} onValueChange={setIsDiklatOffline}>
                    Diklat Offline
                  </Switch>
                  <Input
                    type="text"
                    label="Kota"
                    name="kota"
                    placeholder=" "
                    labelPlacement="outside"
                    description="Cth: Jakarta"
                    variant="bordered"
                    className={isDiklatOffline ? "" : "hidden"}
                    value={value.kota}
                    onChange={handleChange}
                  />
                  <Select
                    name="media"
                    label="Media"
                    variant="bordered" 
                    labelPlacement="outside"
                    placeholder=" "
                    className={isDiklatOffline ? "hidden" : ""}
                    description="Pilih media pembelajaran"
                    selectedKeys={value.media}
                    value={value.media}
                    onChange={handleChange}
                  >
                    {mediaSelection}
                  </Select>  
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xl">
                  <Input
                    type="text"
                    label="Tempat"
                    name="tempat"
                    placeholder=" "
                    labelPlacement="outside"
                    description="Cth: Asrama Pusdiklat AP, Hotel xxx, dll"
                    variant="bordered"
                    className={isDiklatOffline ? "" : "hidden"}
                    value={value.tempat}
                    onChange={handleChange}
                  /> 
                  <Select
                    name="bebanDIPA"
                    label="Beban DIPA"
                    variant="bordered" 
                    labelPlacement="outside"
                    placeholder=" "
                    className={isDiklatOffline ? "" : "hidden"}
                    description="Pilih unit pembebanan"
                    selectedKeys={value.bebanDIPA}
                    onChange={handleChange}
                  >
                    {bebanDIPASelection}
                  </Select>
                </div>
                <Input
                  type="text"
                  label="Unit Pembebanan DIPA"
                  name="unitPembebanan"
                  placeholder=" "
                  labelPlacement="outside"
                  className={(isDiklatOffline && value.bebanDIPA==="3") ? "max-w-xl" : "hidden"}
                  description="Tulis lengkap, Cth: Balai Pendidikan dan Pelatihan Keuangan"
                  variant="bordered"
                  value={value.unitPembebanan}
                  onChange={handleChange}
                />  
                <Autocomplete
                  name="peserta"
                  label="Peserta"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Ketik nama peserta"
                  selectedKey={pegawai}
                  onSelectionChange={handleSelectChangePegawai}
                >
                  {employeeSelection}
                </Autocomplete>
                <div className="grid grid-cols-2 gap-1 max-w-xl">
                  {value.peserta.map((item, index) => (
                    <Chip key={index} onClose={() => handleDeletePeserta(item.No)}>{`${index+1}. ${item.Nama}`}</Chip>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={generateDocument} 
                >
                  Generate ST
                </Button>
                <Button 
                  className={`bg-black text-white ${value.peserta.length>4?"block":"hidden"}`}
                  onClick={generateLampiran} 
                >
                  Generate Lampiran
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
function setData(isDiklatOffline: boolean, value: ValueType) {
  if (isDiklatOffline && value.bebanDIPA==="3") {
    return {
      isOffline: isDiklatOffline,
      year: new Date().getFullYear(),
      isMoreThan4: value.peserta.length > 4,
      judulPelatihan: value.judulPelatihan,
      nomorND: value.nomorND,
      pengirimND: value.pengirimND,
      judulND: value.judulND,
      startDate: formatDate(value.startDate?.toString() || ""),
      endDate: formatDate(value.endDate?.toString() || ""),
      tanggal:  getLamaWaktu(formatDate(value.startDate?.toString() || ""), formatDate(value.endDate?.toString() || "")),
      kota: value.kota,
      tempat: value.tempat,
      unitPembebanan: value.unitPembebanan,
      peserta: value.peserta,
    }
  }
  if (isDiklatOffline) {
    return {
      isOffline: isDiklatOffline,
      year: new Date().getFullYear(),
      isMoreThan4: value.peserta.length > 4,
      judulPelatihan: value.judulPelatihan,
      nomorND: value.nomorND,
      pengirimND: value.pengirimND,
      judulND: value.judulND,
      startDate: formatDate(value.startDate?.toString() || ""),
      endDate: formatDate(value.endDate?.toString() || ""),
      tanggal:  getLamaWaktu(formatDate(value.startDate?.toString() || ""), formatDate(value.endDate?.toString() || "")),
      kota: value.kota,
      tempat: value.tempat,
      unitPembebanan: SELECT_PEMBEBANAN.find(item => item.value===value.bebanDIPA)?.text,
      peserta: value.peserta,
    }
  }

  return {
    isOffline: isDiklatOffline,
    year: new Date().getFullYear(),
    isMoreThan4: value.peserta.length > 4,
    judulPelatihan: value.judulPelatihan,
    nomorND: value.nomorND,
    pengirimND: value.pengirimND,
    judulND: value.judulND,
    startDate: formatDate(value.startDate?.toString() || ""),
    endDate: formatDate(value.endDate?.toString() || ""),
    tanggal:  getLamaWaktu(formatDate(value.startDate?.toString() || ""), formatDate(value.endDate?.toString() || "")),
    media: SELECT_MEDIA.find(item => item.value===value.media)?.text,
    peserta: value.peserta,
  }
}

function getJabatan(emp: EmployeeDataTypes[], v: Key | null): string {
  if(emp.length< 0 || v===0) return "";

  const selectedPegawai = emp.find((item) => item.No == v) || null;
  const isPelaksana = selectedPegawai?.Eselon.toLowerCase()==='pelaksana';
  const isPengawas = selectedPegawai?.Eselon.toLowerCase()==="iv.a" || selectedPegawai?.Eselon.toLowerCase()==="iv.b";
  const unitKerja = getUnitKerjaShort(selectedPegawai?.UnitKerja);

  if(isPengawas){
    return `${emp.find((item) => item.No == v)?.Jabatan} ${unitKerja}` || "" ;
  };

  if(isPelaksana){
    return `Pelaksana ${unitKerja}` ;
  };

  return `${emp.find((item) => item.No == v)?.Jabatan}`
  .replace("Kantor Pelayanan Perbendaharaan Negara","KPPN")
  .replace("Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat","Kanwil DJPb Prov. Sumatera Barat") 
  || ""
}

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

