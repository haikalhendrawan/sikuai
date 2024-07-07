import {useState, useRef} from "react";
import {Button, Input} from "@nextui-org/react";
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

    if(passValue !== "Padang#22"){
      setApiResponse("Wrong password");
      return;
    };

    const formData = new FormData();
    formData.append('file', selectedFile);

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

  return (
    <>
      <div className="flex justify-center items-center gap-3 pt-10">
        <Button startContent={<Iconify icon={"uiw:cloud-upload"}/>} className='w-2/12' >
          {selectedFile?.name}
          <input type='file' className="absolute inset-0 opacity-0 cursor-pointer" ref={fileRef} onChange={handleFileChange}/>
        </Button>
        {/* <Button className="bg-black text-white" onClick={handleFileUpload}>
          Upload
        </Button> */}
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
          Upload
        </Button>
      </div>
      <div className="flex justify-center items-center gap-1 pt-4">
        <p>{apiResponse}</p>
      </div>
    </>
  )
}