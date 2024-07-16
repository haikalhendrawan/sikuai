import { EmployeeDataTypes } from "./types";

interface JumlahPelaksanaProps {
  employee: EmployeeDataTypes[] | []
};

export default function JumlahPelaksana({employee}: JumlahPelaksanaProps) {

  const amount = employee?.length;

  const amountEsII = employee?.filter((item) => item.Eselon.split(".")[0]==="II").length;
  const amountEsIII = employee?.filter((item) => item.Eselon.split(".")[0]==="III").length;
  const amountEsIV = employee?.filter((item) => item.Eselon.split(".")[0]==="IV").length;
  const amountPelaksana = employee?.filter((item) => item.Eselon==="Pelaksana").length;
  const amountFungsional = employee?.filter((item) => item.Eselon.split(".")[0]==="Fungs").length;

  return (
    <div className="flex flex-row">

      <div>
        <h1> Jumlah Pegawai </h1>
        <h6 className="font-bold">{amount}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Es II </h1>
        <h6 className="font-bold">{amountEsII}</h6>

        <h1> Jumlah Pegawai Es III </h1>
        <h6 className="font-bold">{amountEsIII}</h6>

        <h1> Jumlah Pegawai Es IV </h1>
        <h6 className="font-bold">{amountEsIV}</h6>

        <h1> Jumlah Pelaksana </h1> 
        <h6 className="font-bold">{amountPelaksana}</h6>

        <h1> Jumlah Fungsional </h1>
        <h6 className="font-bold">{amountFungsional}</h6>
      </div>

    </div>
  )
}