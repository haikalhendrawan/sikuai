import { EmployeeDataTypes } from "./types";

interface PendidikanProps{
  employee: EmployeeDataTypes[] | []
}

export default function Pendidikan({employee}: PendidikanProps){
  const amount = employee?.length;

  const amountSMA = employee?.filter((item) => item.PendidikanTerakhirShrt === "SMA").length;
  const amountDI = employee?.filter((item) => item.PendidikanTerakhirShrt === "D1").length;
  const amountDIII = employee?.filter((item) => item.PendidikanTerakhirShrt === "D3").length;
  const amountS1 = employee?.filter((item) => item.PendidikanTerakhirShrt === "S1").length;
  const amountS2 = employee?.filter((item) => item.PendidikanTerakhirShrt === "S2").length;
  const amountS3 = employee?.filter((item) => item.PendidikanTerakhirShrt === "S3").length;


  return(
    <>
      <div className="flex flex-row">
        <div>
          <h1> Jumlah Pegawai </h1>
          <h6 className="font-bold">{amount}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai SMA </h1>
          <h6 className="font-bold">{amountSMA}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai DI </h1>
          <h6 className="font-bold">{amountDI}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai DIII </h1>
          <h6 className="font-bold">{amountDIII}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai S1 </h1>
          <h6 className="font-bold">{amountS1}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai S2</h1>
          <h6 className="font-bold">{amountS2}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai S3 </h1>
          <h6 className="font-bold">{amountS3}</h6>
        </div>
      </div>
    
    </>
  )
}