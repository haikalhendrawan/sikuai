import {useState, useMemo} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue, Input, Switch,
        Button, DatePicker, Avatar, Select, SelectItem, Autocomplete, AutocompleteItem, Chip,
        Image, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import { Key } from '@react-types/shared';
import { EmployeeDataTypes } from "./types";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import moment from "moment-timezone";
import { loadFilePromise, getUnitKerjaShort } from "./utils";
import toast from 'react-hot-toast';
import Iconify from "../../components/Iconify";
expressionParser.filters.upper = function (input) {
  if (!input) return input;
  return input.toUpperCase();
};
//-----------------------------------------------------------------------------------------------------------
interface SuratTugasKegModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
};

const SELECT_PEMBEBANAN = [
  {label: "Kanwil DJPb Prov Sumbar", value: "1", text: 'Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat'},
  {label: "Lainnya", value: "2", text: 'lainnya'},
];

const SELECT_UNIT = [
  {label: "Umum", value: "1", text: "Kepala Bagian Umum"},
  {label: "PPA I", value: "2", text: "Kepala Bidang Pembinaan Pelaksanaan Anggaran I"},
  {label: "PPA II", value: "3", text: "Kepala Bidang Pembinaan Pelaksanaan Anggaran II"},
  {label: "PAPK", value: "4", text: "Kepala Bidang Pembinaan Akuntansi dan Pelaporan Keuangan"},
  {label: "SKKI", value: "5", text: "Kepala Bidang Supervisi KPPN dan Kepatuhan Internal"},
  {label: "KPPN Padang", value: "6", text: "Kepala Kantor Pelayanan Perbendaharaan Negara Padang"},
  {label: "KPPN Bukittinggi", value: "7", text: "Kepala Kantor Pelayanan Perbendaharaan Negara Bukittinggi"},
  {label: "KPPN Solok", value: "8", text: "Kepala Kantor Pelayanan Perbendaharaan Negara Solok"},
  {label: "KPPN Lubuk Sikaping", value: "9", text: "Kepala Kantor Pelayanan Perbendaharaan Negara Sijunjung"},
  {label: "KPPN Painan", value: "10", text: "Kepala Kantor Pelayanan Perbendaharaan Negara Painan"},
  {label: "Lainnya", value: "11", text: "lainnya"},
];

const SELECT_SURAT = [
  {label: "Nota Dinas", value: "1", text: "Nota Dinas"},
  {label: "Surat", value: "2", text: "Surat"},
  {label: "Undangan", value: "3", text: "Surat Undangan"},
];

const SELECT_KEGIATAN = [
  {label: "Melaksanakan (sebagai tim/panitia)", value: "1", text: "melaksanakan"},
  {label: "Mengikuti (sebagai peserta)", value: "2", text: "mengikuti"},
];

interface ValueType{
  namaKegiatan: string,
  jenisKegiatan: string,
  nomorND: string,
  pengirimND: string,
  namaPengirimND: string,
  jenisSurat: string,
  judulND: string,
  headerAlternatif: string,
  startDate: DateValue | null,
  endDate: DateValue | null,
  kota: string,
  tempat: string,
  bebanDIPA: string,
  unitPembebanan: string,
  peserta: EmployeeDataTypes[] | []
};

//-----------------------------------------------------------------------------------------------------------
export default function SuratTugasKegModal({isOpen, onOpenChange, employee}: SuratTugasKegModalProps) {
  const [isHeaderAlternatif, setIsHeaderAlternatif] = useState<boolean>(false);

  const [pegawai, setPegawai] = useState<Key | null>(null);

  const [value, setValue] = useState<ValueType>({
    namaKegiatan: '',
    jenisKegiatan: '',
    nomorND: '',
    pengirimND: '',
    namaPengirimND: '',
    judulND: '',
    jenisSurat: '',
    headerAlternatif: '',
    startDate: null,
    endDate: null,
    kota: '',
    tempat: '',
    bebanDIPA: '',
    unitPembebanan: '',
    peserta: []
  });

  const generateSTKegiatan = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodeSTKegiatan.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      const isValidated = validateInput(value, isHeaderAlternatif);
      if(!isValidated){
        return toast.error('Form tidak lengkap', {
          position: 'top-right',
          className:'text-sm'
        });
      };

      console.log(setData(isHeaderAlternatif, value, employee));
      doc.render({
        value: setData(isHeaderAlternatif, value, employee)
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, `stKegiatan_${new Date().getTime()}.docx`);
    } catch(err: any) {
      console.error(JSON.stringify(err.message));
      toast.error(JSON.stringify(err.message), {
        position: 'top-right',
        className:'text-sm'
      });
    }
  };

  const generateLampiranKegiatan = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/lampiranNodeSTKegiatan.docx`);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
  
      const isValidated = validateInput(value, isHeaderAlternatif);
      if(!isValidated){
        return toast.error('Form tidak lengkap', {
          position: 'top-right',
          className:'text-sm'
        });
      };

      doc.render({
        value: setData(isHeaderAlternatif, value, employee)
      });
  
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
  
      saveAs(out, `lampiranSTKegiatan_${new Date().getTime()}.docx`);
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
      namaKegiatan: '',
      jenisKegiatan: '',
      nomorND: '',
      pengirimND: '',
      namaPengirimND: '',
      judulND: '',
      jenisSurat: '',
      headerAlternatif: '',
      startDate: null,
      endDate: null,
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

  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <Image
          alt={'title'}
          className="object-cover"
          src={'/header-alternatif.png'}
        />
      </div>
    </PopoverContent>
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
              <ModalHeader className="flex flex-col gap-2">Surat Tugas Kegiatan</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="namaKegiatan"
                  label="Nama Kegiatan"
                  className="max-w-xl"
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Kegiatan Monev TKD Tahun 2024, Kegiatan Treasury Art Competition Tahun 2024"
                  variant="bordered"
                  value={value.namaKegiatan}
                  onChange={handleChange}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Kegiatan</span>
                    </div>
                  }
                />
                <Select
                  name="jenisKegiatan"
                  label="Jenis Kegiatan"
                  variant="bordered" 
                  className={"max-w-xl"}
                  placeholder=" "
                  labelPlacement="outside"
                  value={value.jenisKegiatan}
                  onChange={(e) => handleChange(e)}
                  description="Pilih jenis kepesertaan"
                >
                  {SELECT_KEGIATAN.map((row) => (
                    <SelectItem key={row.value} value={row.value}>
                      {row.label}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex flex-row gap-2 max-w-xl mt-1 mb-2">
                  <Switch name='isTTE' size="sm" checked={isHeaderAlternatif} onValueChange={setIsHeaderAlternatif}>
                    Header Alternatif 
                  </Switch>
                  <Popover key={0} placement="right-start" backdrop="opaque">
                    <PopoverTrigger>
                      <Iconify icon="solar:question-circle-bold"/>
                    </PopoverTrigger>
                    {content}
                  </Popover>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-xl">
                  <Input
                    type="text"
                    name="nomorND"
                    label="Nomor Surat Rujukan"
                    placeholder=" "
                    labelPlacement="outside"
                    description="Cth: ND-22/PB.1/2024"
                    variant="bordered"
                    className={!isHeaderAlternatif ? "col-span-1" : "hidden"}
                    value={value.nomorND}
                    onChange={handleChange}
                  />
                  <Select
                    name="jenisSurat"
                    label="Jenis Surat"
                    variant="bordered" 
                    className={!isHeaderAlternatif ? "col-span-2" : "hidden"}
                    placeholder=" "
                    labelPlacement="outside"
                    value={value.jenisSurat}
                    onChange={(e) => handleChange(e)}
                    description="Berupa Nota Dinas/Surat/Undangan"
                  >
                    {SELECT_SURAT.map((row) => (
                      <SelectItem key={row.value} value={row.value}>
                        {row.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Select
                    name="pengirimND"
                    label="Pengirim Surat Rujukan"
                    variant="bordered" 
                    className={!isHeaderAlternatif ? "max-w-xl" : "hidden"}
                    placeholder=" "
                    labelPlacement="outside"
                    value={value.pengirimND}
                    onChange={(e) => handleChange(e)}
                    description="Bidang/KPPN/Eksternal"
                  >
                    {SELECT_UNIT.map((row) => (
                      <SelectItem key={row.value} value={row.value}>
                        {row.label}
                      </SelectItem>
                    ))}
                </Select>
                <Input
                  type="text"
                  name="namaPengirimND"
                  label="Unit Pengirim Surat Rujukan"
                  className={value.pengirimND==="11" && !isHeaderAlternatif ? "max-w-xl" : "hidden"}
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: BPJS Kesehatan Kota Padang, Satker xxx"
                  variant="bordered"
                  value={value.namaPengirimND}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="judulND"
                  label="Judul Surat Usulan"
                  className={!isHeaderAlternatif ? "max-w-xl" : "hidden"}
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Usulan Surat Tugas Kegiatan Monev TKD Tahun 2024"
                  variant="bordered"
                  value={value.judulND}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="headerAlternatif"
                  label="Header ST"
                  placeholder=""
                  labelPlacement="outside"
                  description="Cth: Dalam rangka pelaksanaan tugas dan fungsi Kantor Wilayah DJPb Provinsi Sumatera Barat"
                  variant="bordered"
                  startContent={
                    <div className="pointer-events-none flex items-center w-1/5">
                      <span className="text-default-400 text-small">Dalam rangka</span>
                    </div>
                  }
                  className={isHeaderAlternatif ? "max-w-xl" : "hidden"}
                  value={value.headerAlternatif}
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
                  <Input
                    type="text"
                    label="Kota"
                    name="kota"
                    placeholder=" "
                    labelPlacement="outside"
                    description="Cth: Padang"
                    variant="bordered"
                    value={value.kota}
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    label="Tempat"
                    name="tempat"
                    placeholder=" "
                    labelPlacement="outside"
                    description="Cth: UMKM xxx, Satker xxx, dll"
                    variant="bordered"
                    value={value.tempat}
                    onChange={handleChange}
                  /> 
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-xl">
                  <Select
                    name="bebanDIPA"
                    label="Beban DIPA"
                    variant="bordered" 
                    labelPlacement="outside"
                    placeholder= "Pilih unit pembebanan"
                    selectedKeys={value.bebanDIPA}
                    onChange={handleChange}
                  >
                    {bebanDIPASelection}
                  </Select>
                </div>
                <Input
                  type="text"
                  label="Unit Pembebanan DIPA Lainnya"
                  name="unitPembebanan"
                  placeholder=" "
                  labelPlacement="outside"
                  className= {(value.bebanDIPA==="2") ? "max-w-xl" : "hidden"} 
                  description="Cth: Bawaslu Provinsi Sumatera Barat, Satker xxx"
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
                <Input
                  type="text"
                  label="Judul ST (Copas ke Nadine)"
                  className="pt-4"
                  name="judulST"
                  placeholder=" "
                  labelPlacement="outside"
                  disabled
                  value={`Penugasan Mengikuti ${value.namaKegiatan} a.n. ${getSTJudulNama(value.peserta)}`}
                >
                </Input>
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={generateSTKegiatan} 
                >
                  Generate ST
                </Button>
                <Button 
                  className={`bg-black text-white ${value.peserta.length>4?"block":"hidden"}`}
                  onClick={generateLampiranKegiatan} 
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
function setData(isHeaderAlternatif: boolean, value: ValueType, employee: EmployeeDataTypes[]) {
  return {
    isHeaderAlternatif: isHeaderAlternatif,
    year: new Date().getFullYear(),
    isMoreThan4: value.peserta.length > 4,
    headerAlternatif: value.headerAlternatif,
    namaKegiatan: value.namaKegiatan,
    jenisKegiatan: SELECT_KEGIATAN.find(item => item.value===value.jenisKegiatan)?.text,
    sebutanLampiran: value.jenisKegiatan==="1"?"Tim":"Peserta",
    nomorND: value.nomorND,
    jenisSurat: SELECT_SURAT.find(item => item.value===value.jenisSurat)?.text,
    pengirimND: value.pengirimND==="11"?value.namaPengirimND:SELECT_UNIT.find((row) => row.value === value.pengirimND)?.text,
    judulND: value.judulND,
    startDate: formatDate(value.startDate?.toString() || ""),
    endDate: formatDate(value.endDate?.toString() || ""),
    tanggal:  getLamaWaktu(formatDate(value.startDate?.toString() || ""), formatDate(value.endDate?.toString() || "")),
    kota: value.kota,
    tempat: value.tempat,
    unitPembebanan: value.bebanDIPA==="2"?value.unitPembebanan:SELECT_PEMBEBANAN.find(item => item.value===value.bebanDIPA)?.text,
    peserta: value.peserta,
    kKanwil: employee.find((item) => item.Jabatan === "Kepala Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat")?.Nama
  }
};

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

function validateInput(value: ValueType, isHeaderAlternatif: boolean) {
  if(value.namaKegiatan === "" 
    || value.startDate === null
    || value.endDate === null
    || value.peserta.length===0
    || value.kota === ""
    || value.tempat === ""
    || value.bebanDIPA === "") {
    return false
  };

  if(isHeaderAlternatif){
    if(value.headerAlternatif === "") {
      return false
    }
  };

  return true
};

function getSTJudulNama(peserta: EmployeeDataTypes[]) {
  if(peserta.length=== 0) {
    return ""
  };

  const isMoreThan1 = peserta.length > 1;
  if(isMoreThan1){
    return `${peserta[0].Nama}, dkk.`
  };

  return `${peserta[0].Nama} NIP ${peserta[0].NIP.slice(0)}`
};


