import {useState, useMemo, useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue, Input,
        Button, Avatar, Autocomplete, AutocompleteItem, Chip,
        Textarea, useDisclosure} from "@nextui-org/react";
import { Key } from '@react-types/shared';
import { DasarHukumTypes, EmployeeDataTypes, PesertaSKDataTypes, UnitAcaraTypes } from "../types";
import axiosAuth from "../../../config/axios";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import moment from "moment-timezone";
import { loadFilePromise, getUnitKerjaShort } from "../utils";
import toast from 'react-hot-toast';
import DasarHukumModal from "./DasarHukumModal";
import UnitKegiatanModal from "./UnitKegiatanModal";
expressionParser.filters.upper = function (input) {
  if (!input) return input;
  return input.toUpperCase();
};
//-----------------------------------------------------------------------------------------------------------
interface SuratSKKegiatanModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
  employee: EmployeeDataTypes[] | []
}; 
interface ValueType{
  namaKegiatan: string,
  nomorND: string,
  latarBelakang: string,
  dasarHukum: any[] | [],
  tanggalBerlaku: DateValue | null,
  startDate: DateValue | null,
  peserta: PesertaSKDataTypes[] | [],
  seksi: UnitAcaraTypes[] | [],
};
//-----------------------------------------------------------------------------------------------------------
export default function SuratSKKegiatanModal({isOpen, onOpenChange, employee}: SuratSKKegiatanModalProps) {

  const {isOpen: isOpen2, onOpenChange: onOpenChange2} = useDisclosure(); // add dasar hukum modal

  const {isOpen: isOpen3, onOpenChange: onOpenChange3} = useDisclosure(); // add unit modal

  // const [pegawai, setPegawai] = useState<Key | null>(null);

  const [dasar, setDasar] = useState<Key | null>(null);

  const [unit, setUnit] = useState<Key | null>(null);

  const [value, setValue] = useState<ValueType>({
    namaKegiatan: '',
    nomorND: '',
    latarBelakang: '',
    dasarHukum: [],
    tanggalBerlaku: null,
    startDate: null,
    peserta: [],
    seksi: [],
  });

  const [dasarValue, setDasarValue] = useState<DasarHukumTypes[] | []>([]);

  const [unitValue, setUnitValue] = useState<UnitAcaraTypes[] | []>([]);

  const generateSTKegiatan = async () => {
    try {
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/templateNodeSKKegiatan.docx`);
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
  
      saveAs(out, `skKegiatan_${new Date().getTime()}.docx`);
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
      const content = await loadFilePromise(`${import.meta.env.VITE_API_URL}/template/lampiranNodeSKKegiatan.docx`);
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
  
      saveAs(out, `lampiranSKKegiatan_${new Date().getTime()}.docx`);
      // console.log(value)
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

  const handleSelectChangePegawai = (v: Key | null, unitAcara: string | number) => {
    // setPegawai(v);

    if(v){
      const selected = employee.find((item) => item.No==v);
      if(selected){
        setValue((prev) => ({
          ...prev, 
          peserta: [...prev.peserta, {
            ...selected,
            index: prev.peserta.length+1, 
            NIP: selected.NIP.slice(1),
            Jabatan: getJabatan(employee, selected.No),
            unitAcara: unitAcara,
            namaUnitAcara: unitValue.find((item) => item.id == unitAcara)?.nama,
            isKetua: 0,
            kedudukan: `Anggota ${unitValue.find((item) => item.id == unitAcara)?.nama}`,
            tugas: getTugas(unitValue, unitAcara, value) 
          }]}
        ));
      }
    };
  };

  const handleSelectChangeKetua = (value: Key | null, unitAcara: string | number) => {
    // setPegawai(value);

    if(value){
      const selected = employee.find((item) => item.No==value);
      if(selected){
        setValue((prev) => ({
          ...prev, 
          peserta: [...prev.peserta, {
            ...selected,
            index: prev.peserta.length+1, 
            NIP: selected.NIP.slice(1),
            Jabatan: getJabatan(employee, selected.No),
            unitAcara: unitAcara,
            namaUnitAcara: unitValue.find((item) => item.id == unitAcara)?.nama,
            isKetua: 1,
            kedudukan: `Ketua ${unitValue.find((item) => item.id == unitAcara)?.nama}`,
            tugas: [unitValue.find((item) => item.id == unitAcara)?.ketuaTusi]
          }]}
        ));
      }
    };
  };

  const handleSelectChangeDasar = (value: Key | null) => {
    setDasar(value);

    if(value){
      const selected = dasarValue[value as number];
      if(selected){
        setValue((prev) => ({
          ...prev, 
          dasarHukum: [...prev.dasarHukum, selected]}
        ));
      }
    };
  };

  const handleSelectChangeUnit = (v: Key | null) => {
    setUnit(v);

    if(value){
      const selected = unitValue[v as number];
      if(selected){
        setValue((prev) => ({
          ...prev, 
          seksi: [...prev.seksi, selected]}
        ));
      }
      }
  };

  const handleDeletePeserta = (value: number, unitAcara: string | number) => {
    console.log(value, unitAcara)
    setValue((prev) => ({
      ...prev, 
      peserta: prev.peserta.filter((item) => !(item.unitAcara === unitAcara && item.No === value))
    }));
  };
  
  const handleDeleteDasar = (value: number) => {
    setValue((prev) => ({
      ...prev, 
      dasarHukum: prev.dasarHukum.filter((item) => item.id !== value
      )}  
    ));
  };

  const handleDeleteSeksi = (value: number) => {
    setValue((prev) => ({
      ...prev, 
      seksi: prev.seksi.filter((item) => item.id != value),
      peserta: prev.peserta.filter((item) => item.unitAcara != value)
    }));
  };

  const handleReset = () => {
    setValue({
      namaKegiatan: '',
      nomorND: '',
      latarBelakang: '',
      dasarHukum: [],
      tanggalBerlaku: null,
      startDate: null,
      peserta: [],
      seksi: [],
    });

    // setPegawai(null);
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

  const dasarSelection = useMemo(() => 
    dasarValue?.map((item: DasarHukumTypes, index: number) => (
      <AutocompleteItem key={index} textValue={`${item.nomor} tentang ${item.judul}`}>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <span className="text-small">{`${item.singkatan} ${item.nomor} tentang ${item.judul}`}</span>
          </div>
        </div>
      </AutocompleteItem>
    )), 
    [dasarValue]
  );

  const unitSelection = useMemo(() =>
    unitValue?.map((item: any, index) => (
      <AutocompleteItem key={index} textValue={item.nama}>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <span className="text-small">{item.nama}</span>
          </div>
        </div>
      </AutocompleteItem>
    )), 
    [unitValue]
  );

  const assignPanitaTable = useMemo(() => value.seksi.map((item, index) => (
    <>
      <tr key={index} className="border-collapse border border-slate-400 p-2 ">
        <td className="p-4">
          <Chip key={item.id} onClose={() => handleDeleteSeksi(item.id)}>{`${index+1}. ${item.nama}`}</Chip>
        </td>
        <td className="p-4">
          <Autocomplete
            name="ketua"
            label="Ketua"
            variant="bordered" 
            className="max-w-xl"
            labelPlacement="outside"
            placeholder="Ketik nama ketua"
            onSelectionChange={(value) => handleSelectChangeKetua(value, item.id)}
          >
            {employeeSelection} 
          </Autocomplete>
          <Autocomplete
            name="peserta"
            label="Peserta"
            variant="bordered" 
            className={item.noMember?"hidden":"max-w-xl mt-2"}
            labelPlacement="outside"
            placeholder="Ketik nama peserta"
            onSelectionChange={(value) => handleSelectChangePegawai(value, item.id)}
          >
            {employeeSelection} 
          </Autocomplete>
          <div className="grid grid-cols-1 gap-1 max-w-xl mt-2">
            {value.peserta.filter((p) => p.unitAcara === item.id).map((i, index2) => (
              <Chip key={i.No} onClose={() => handleDeletePeserta(i.No, i.unitAcara ?? "")}>
                {`${index2+1}. ${i.Nama}`}
              </Chip>
            ))}
          </div>
        </td>
      </tr>
    </>
  ))
  , [unitValue, value]);

  async function getDasarHukum() {
    try{
      const response = await axiosAuth.get(`/getAllDasarHukum`);
      setDasarValue(response.data.rows);
    }catch(err){
      console.log(err)
    }
  };

  async function getUnitAcara() {
    try{
      const response = await axiosAuth.get(`/getAllUnitAcara`);
      setUnitValue(response.data.rows.map((item: any) => ({
        id: item.id, 
        nama: item.nama,
        tusi: item.tusi,
        noMember: item.no_member,
        ketuaTusi: item.ketua_tusi}
      )));
    }catch(err){
      console.log(err)
    }
  };

  useEffect(() => {
    getDasarHukum();
    getUnitAcara();
  }, [isOpen2, isOpen3]);


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
              <ModalHeader className="flex flex-col gap-2">Surat Keputusan Tim/Panitia Kegiatan</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  name="namaKegiatan"
                  label="Nama Kegiatan"
                  className="max-w-xl"
                  placeholder=" "
                  labelPlacement="outside"
                  description="Cth: Kegiatan Executive Meeting FEBA Sumbar, Kegiatan Pembinaan UMKM"
                  variant="bordered"
                  value={value.namaKegiatan}
                  onChange={handleChange}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Kegiatan</span>
                    </div>
                  }
                />
                <Textarea
                  name="latarBelakang"
                  label="Latar Belakang"
                  variant="bordered"
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder=" "
                  value={value.latarBelakang}
                  onChange={handleChange}
                  description='Cth: Dalam rangka kebutuhan koordinasi dan kolaborasi antar pemangku kepentingan di bidang ekonomi dan pembangunan Sumatera Barat serta dalam rangka mendukung strategi perekonomian dan pembangunan yang holistik di Sumatera Barat'
                  startContent={
                    <div className="pointer-events-none flex items-center w-28">
                      <span className="text-default-400 text-small">Dalam rangka</span>
                    </div>
                  }
                />
                <Autocomplete
                  name="dasarHukum"
                  label="Dasar Hukum"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Cari Dasar Hukum"
                  selectedKey={dasar}
                  onSelectionChange={handleSelectChangeDasar}
                >
                  {dasarSelection}
                </Autocomplete>
                <p className="text-small text-primary-500 cursor-pointer w-fit" onClick={onOpenChange2}>tambah dasar hukum lain</p>
                <div className="grid grid-cols-2 gap-1 max-w-xl">
                  {value.dasarHukum.map((item, index) => (
                    <Chip key={index} onClose={() => handleDeleteDasar(item.id)}>{`${index+1}. ${item.nomor}`}</Chip>
                  ))}
                </div>
                <Autocomplete
                  name="unitAcara"
                  label="Assign Unit"
                  variant="bordered" 
                  className="max-w-xl"
                  labelPlacement="outside"
                  placeholder="Pilih Bidang Acara"
                  selectedKey={unit}
                  onSelectionChange={handleSelectChangeUnit}
                >
                  {unitSelection}
                </Autocomplete>
                <p className="text-small text-primary-500 cursor-pointer w-fit" onClick={onOpenChange3}>tambah unit lain</p>
                <table className="border-collapse border border-slate-100">
                  <tbody className="border-collapse border border-slate-100">
                   {assignPanitaTable}
                  </tbody>
                </table>
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button 
                  className='bg-black text-white' 
                  onClick={generateSTKegiatan} 
                >
                  Generate SK
                </Button>
                <Button 
                  className={`bg-black text-white ${value.peserta.length>0?"block":"hidden"}`}
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

      <DasarHukumModal isOpen={isOpen2} onOpenChange={onOpenChange2} />

      <UnitKegiatanModal isOpen={isOpen3} onOpenChange={onOpenChange3} />
    </>
  );
}

// -----------------------------------------------------------------------------------------------------
function setData(value: ValueType, employee: EmployeeDataTypes[]) {
  return {
    namaKegiatan: value.namaKegiatan,
    latarBelakang: value.latarBelakang,
    dasarHukum: value.dasarHukum,
    tanggalBerlaku: formatDate(value?.tanggalBerlaku?.toString() || ""),
    kepalaKanwil: employee.filter( item => item.Jabatan.toLowerCase()==="kepala kantor wilayah direktorat jenderal perbendaharaan provinsi sumatera barat")[0]?.Nama, 
    peserta: value.peserta,
    seksi: value.seksi
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

function getTugas(unitValue: unitAcaraTypes[], unitAcara: string | number, value: ValueType) {
  if(value.peserta.filter((item) => (item.unitAcara === unitAcara && item.isKetua===0)).length > 0){
    return []
  };

  return unitValue.find((item) => item.id == unitAcara)?.tusi
};



