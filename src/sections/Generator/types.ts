export interface EmployeeFormTypes{
  no: number,
  nama: string,
  nip: string,
  pangkat: string,
  gol: string,
  gelarDepan: string,
  gelarBelakang: string,
  tempatLahir: string,
  tanggalLahir: string,
  email: string,
  hp: string,
  esIII: string,
  esIV: string,
  jabatan: string,
  pendidikan: string
};

export interface EmployeeDataTypes{
  No: number;
  NIPFormatBaru: string;
  NIP: string;
  NamaGelar: string;
  GelarDepan: string;
  Nama: string;
  GelarBelakang: string;
  NamaTerakhir: string;
  Sex: string;
  BMI: string;
  KetBMI: string;
  Pangkat: string;
  Gol: string;
  GolTMT: string;
  Eselon: string;
  EselonTMT: string;
  TMTJabatan: string;
  TempatLahir: string;
  TanggalLahir: string;
  Usia: number;
  PendidikanTerakhir: string;
  PendidikanTerakhirShrt: string;
  Agama: string;
  Jabatan: string;
  KodeUnit: string;
  UnitEselonII: string;
  UnitEselonIII: string;
  UnitEselonIV: string;
  UnitKerja: string;
  UnitSulitTrs: string;
  RemoteZone: string;
  Status: string;
  AktifYN: string;
  UnitPertama: string;
  MasaKerjaGolonganThn: number;
  MasaKerjaGolonganBln: number;
  MasaKerjaSeluruhnyaThn: number;
  MasaKerjaSeluruhnyaBln: number;
  HP: string;
  Email: string;
};

export interface PesertaSKDataTypes{
  No: number;
  NIPFormatBaru: string;
  NIP: string;
  NamaGelar: string;
  GelarDepan: string;
  Nama: string;
  GelarBelakang: string;
  NamaTerakhir: string;
  Sex: string;
  BMI: string;
  KetBMI: string;
  Pangkat: string;
  Gol: string;
  GolTMT: string;
  Eselon: string;
  EselonTMT: string;
  TMTJabatan: string;
  TempatLahir: string;
  TanggalLahir: string;
  Usia: number;
  PendidikanTerakhir: string;
  PendidikanTerakhirShrt: string;
  Agama: string;
  Jabatan: string;
  KodeUnit: string;
  UnitEselonII: string;
  UnitEselonIII: string;
  UnitEselonIV: string;
  UnitKerja: string;
  UnitSulitTrs: string;
  RemoteZone: string;
  Status: string;
  AktifYN: string;
  UnitPertama: string;
  MasaKerjaGolonganThn: number;
  MasaKerjaGolonganBln: number;
  MasaKerjaSeluruhnyaThn: number;
  MasaKerjaSeluruhnyaBln: number;
  HP: string;
  Email: string;
  unitAcara?: string | number
  namaUnitAcara?: string
  isKetua?: number
  kedudukan?: string
  tugas?: string[] | [] | any[]
};

export interface DasarHukumTypes{
  id: number,
  nomor: string,
  judul: string,
  jenis: string,
  singkatan: string
};

export interface UnitAcaraTypes{
  id: number,
  nama: string,
  tusi: string[],
  ketuaTusi: string,
  noMember: number
};


