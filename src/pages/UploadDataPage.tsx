import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import  UploadDataSection  from "../sections/UploadData/UploadDataSection";
import {Button} from "@nextui-org/react";
import Iconify from "../components/Iconify";
import Footer from "../components/Footer";


export default function UploadDataPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Upload</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center h-screen bg-[url('/tail-gradient-reverse.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-row w-full items-center justify-center gap-2">
          <Button isIconOnly className='bg-white' onClick={() => navigate(-1)}>
            <Iconify icon={"ion:arrow-back"}/>
          </Button>
          <h1 className="text-3xl font-bold">Upload Data</h1>
        </div>
        <div className="w-full  p-4">
          <UploadDataSection />
        </div>
        <Footer />
      </div>
    </>
  )
}