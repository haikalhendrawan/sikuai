import { EmployeeDataTypes } from "./types";

interface GenderProps {
  employee: EmployeeDataTypes[] | []
};

export default function Gender({employee}: GenderProps){
  const amount = employee?.length;

  const amountL = employee?.filter((item) => item.Sex === "L").length;
  const amountP = employee?.filter((item) => item.Sex === "P").length;

  const amountLPelaksana = employee?.filter((item) => item.Sex === "L" && item.Eselon.toLowerCase() === "pelaksana").length;
  const amountPPelaksana = employee?.filter((item) => item.Sex === "P" && item.Eselon.toLowerCase() === "pelaksana").length;

  const amountLPejabat = employee?.filter((item) => item.Sex === "L" && item.Eselon.toLowerCase() !== "pelaksana").length;
  const amountPPejabat = employee?.filter((item) => item.Sex === "P" && item.Eselon.toLowerCase() !== "pelaksana").length;

  return(
    <>
      <div className="flex flex-row">
      <div>
        <h1> Jumlah Pegawai </h1>
        <h6 className="font-bold">{amount}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Laki-Laki </h1>
        <h6 className="font-bold">{amountL}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Perempuan </h1>
        <h6 className="font-bold">{amountP}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Laki-Laki Pelaksana</h1>
        <h6 className="font-bold">{amountLPelaksana}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Perempuan Pelaksana </h1>
        <h6 className="font-bold">{amountPPelaksana}</h6>
      </div>
      </div>

      <div className="flex flex-row">
        <div>
          <h1> Jumlah Pegawai </h1>
          <h6 className="font-bold">{amount}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Laki-Laki Pejabat </h1>
          <h6 className="font-bold">{amountLPejabat}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Perempuan Pejabat </h1>
          <h6 className="font-bold">{amountPPejabat}</h6>
        </div>

        {/* <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 40 - 49 </h1>
          <h6 className="font-bold"></h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 50 - 59 </h1>
          <h6 className="font-bold"></h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 60 - 59 </h1>
          <h6 className="font-bold"></h6>
        </div> */}
      </div>
    </>
  )




}