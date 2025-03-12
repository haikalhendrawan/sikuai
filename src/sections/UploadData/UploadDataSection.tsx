import {useState, useRef} from "react";
import {Button, Input, PopoverContent, Popover, PopoverTrigger} from "@nextui-org/react";
import Iconify from "../../components/Iconify";
import axiosAuth from "../../config/axios";
// -------------------------------------------------------------------------------------------

export default function UploadDataSection() {
  const [apiResponse, setApiResponse] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);

  const [passValue, setPassValue] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassValue(e.target.value);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setApiResponse("No file selected");
      return;
    };

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('password', passValue);

    try { 
      setApiResponse("Loading...");
      const response = await axiosAuth.post('/injectEmployee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setApiResponse(response.data.message);
    }catch(err: any){
      if(err.response){
        console.error(err);
        setApiResponse(err.response.data.message);
      }else{
        setApiResponse(err.message);
      };
    }
  };

  const popoverPanduan = (
    <PopoverContent>
      <div className="px-1 py-2">
        <ol>
          <li>1. Buka Pbnopen, pada menu Pegawai - Sub Menu Pencarian -Pegawai </li>
          <li>2. Klik tombol pencarian detil </li>
          <li>3. Pilih unit kerja Kanwil DJPb Sumbar </li>
          <li>4. Centang checkbox tanggal </li>
          <li>5. Centang checkbox nomor HP </li>
          <li>6. Centang checkbox Email </li>
          <li>7. Klik Go, data akan muncul pada halaman terpisah </li>
          <li>8. Pada halaman tersebut blok seluruh data (CTRL+A  dan  CTRL+C) </li>
          <li>9. Buka microsoft excel dan paste (CTRL+V)</li>
          <li>10. Hapus baris 1-12 (agar header tabel berada pada baris 1)</li>
          <li>11. Save file tersebut, kemudian upload pada form di halaman ini</li>
          <li>12. Masukan password dan kirim</li>
          <li>13. Akan muncul "add employee success" apabila upload data berhasil</li>
        </ol>
      </div>
    </PopoverContent>
  );

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3 pt-10">
        <Popover key={0} placement="right-start" backdrop="opaque">
          <PopoverTrigger>
            <a target="blank" className="text-sm text-blue-600 cursor-pointer"> Panduan</a>
            {/* <Iconify icon="solar:question-circle-bold"/> */}
          </PopoverTrigger>
          {popoverPanduan}
        </Popover>

        <div className="flex flex-row gap-2 items-center">
          <Button endContent={<Iconify icon={"uiw:cloud-upload"}/>} className='w-80' >  
            {selectedFile?.name || "upload"}
            <input type='file' className="absolute inset-0 opacity-0 cursor-pointer" ref={fileRef} onChange={handleFileChange}/>
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center gap-3 pt-4">
        <Input
          variant="bordered"
          placeholder="Masukkan password"
          value={passValue}
          onChange={handleChange}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <Iconify icon={"eva:eye-fill"} className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <Iconify icon={"eva:eye-off-fill"} className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        <Button className="bg-black text-white" onClick={handleFileUpload}>
          Kirim
        </Button>
      </div>
      <div className="flex justify-center items-center gap-1 pt-4">
        <p>{apiResponse}</p>
      </div>
    </>
  )
}