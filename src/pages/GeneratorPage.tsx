import { Helmet } from "react-helmet-async";
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import {Button} from "@nextui-org/react";


function loadFile(url: string, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
};



export default function GeneratorPage() {
  const asli = {
    nama: 'Joko Supriyanto',
    nip: '197603071996031001',
    jabatan: 'Kepala Kantor Pelayanan Perbendaharaan Negara Padang',
    unitKerja: 'Kantor Pelayanan Perbendaharaan Negara Padang',
    tanggalMulai: '14 Juni 2024',
  };

  const pengganti = {
    nama: 'Nuryasin',
    nip: '197107311992011003',
    pangkat: 'Pembina',
    gol: 'IV/a',
    jabatan: 'Kepala Seksi Manajemen Satker dan Kepatuhan Internal',
  };

  const info = {
    sebutan: 'Sdr.',
    alasan: 'Melaksanakan Cuti Tahunan',  
    lamaWaktu: '14 Juni 2024',
    ending: ', disamping melaksanakan tugas sebagai Kepala Seksi Manajemen Satker dan Kepatuhan Internal.',
    unitKecil: 'Kepala Kantor Pelayanan Perbendaharaan Negara Padang',
  };

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

  return (
    <>
      <Helmet>
        <title>Event List </title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-[url('/bg-effect.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-col w-full items-center justify-center gap-2 mb-10">
          <h1 className="text-3xl font-bold">Generator</h1>
        </div>
        <div className="w-full max-w-[800px] p-4">
          <Button onClick={generateDocument}>Generate</Button>
        </div>
      </div>
    </>
  )
}