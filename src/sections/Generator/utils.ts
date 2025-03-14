import PizZipUtils from 'pizzip/utils/index.js';

function loadFile(url: string, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
};


export function loadFilePromise(url: string) {
  return new Promise((resolve, reject) => {
    loadFile(url, (error: any, content: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(content);
      }
    });
  });
};


export function getUnitKerja(unit: string | undefined){
  if(!unit){
    return ""
  };

  console.log(unit)
  
  return unit
  .replace("Kanwil DJPBN Prov. Sumatera Barat", "Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat")
  .replace("(A1)", "")
  .replace("(A2)", "")
  .replace("KPPN", "Kantor Pelayanan Perbendaharaan Negara")
};

export function getUnitKerjaShort(unit: string | undefined){
  if(!unit){
    return ""
  };
  
  return unit
  .replace("Kanwil DJPBN Prov. Sumatera Barat", "Kanwil DJPb Prov. Sumatera Barat")
  .replace("(A1)", "")
  .replace("(A2)", "")
};
