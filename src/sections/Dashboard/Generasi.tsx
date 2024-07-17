import {useState} from "react";
import {Button} from "@nextui-org/react";
import { EmployeeDataTypes } from "./types";

interface GenerasiProps {
  employee: EmployeeDataTypes[] | []
};

export default function Generasi({employee}: GenerasiProps){
  const amount = employee?.length;

  const year = new Date().getFullYear();
  const boomer = {max: year-1946, min: year-1964};
  const x = {max: year-1965, min: year-1980};
  const milenial = {max: year-1981, min: year-1996};
  const centennial = {max: year-1997, min: year-2012};

  const amountBoomer = employee?.filter((item) => item.Usia >= boomer.min && item.Usia <= boomer.max).length;
  const amountX = employee?.filter((item) => item.Usia >= x.min && item.Usia <= x.max).length;
  const amountMilenial = employee?.filter((item) => item.Usia >= milenial.min && item.Usia <= milenial.max).length;
  const amountCentennial = employee?.filter((item) => item.Usia >= centennial.min && item.Usia <= centennial.max).length;

  const usia2029 = employee?.filter((item) => item.Usia >= 20 && item.Usia < 30).length;
  const usia3039 = employee?.filter((item) => item.Usia >= 30 && item.Usia < 40).length;
  const usia4049 = employee?.filter((item) => item.Usia >= 40 && item.Usia < 50).length;
  const usia5059 = employee?.filter((item) => item.Usia >= 50 && item.Usia < 60).length;
  const usia6069 = employee?.filter((item) => item.Usia >= 60 && item.Usia < 70).length;

  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  const handleSortAge = (a: number, b: number) => {
    if (order === 'ASC') {
      return a - b;
    } else {
      return b - a;
    }
  };
    

  return(
    <>
      <div className="flex flex-row">
      <div>
        <h1> Jumlah Pegawai </h1>
        <h6 className="font-bold">{amount}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Generasi Baby Boomers </h1>
        <h6 className="font-bold">{amountBoomer}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Generasi X </h1>
        <h6 className="font-bold">{amountX}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Generasi Milenial</h1>
        <h6 className="font-bold">{amountMilenial}</h6>
      </div>

      <div className="flex-flex-col">
        <h1> Jumlah Pegawai Generasi Centennial </h1>
        <h6 className="font-bold">{amountCentennial}</h6>
      </div>
      </div>

      <div className="flex flex-row">
        <div>
          <h1> Jumlah Pegawai </h1>
          <h6 className="font-bold">{amount}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 20 - 29 </h1>
          <h6 className="font-bold">{usia2029}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 30 - 39 </h1>
          <h6 className="font-bold">{usia3039}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 40 - 49 </h1>
          <h6 className="font-bold">{usia4049}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 50 - 59 </h1>
          <h6 className="font-bold">{usia5059}</h6>
        </div>

        <div className="flex-flex-col">
          <h1> Jumlah Pegawai Usia 60 - 59 </h1>
          <h6 className="font-bold">{usia6069}</h6>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama <Button onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')}>Filter</Button></th>
            <th>Usia</th>
          </tr>
        </thead>
        <tbody>
          {employee?.sort((a, b) => handleSortAge(a.Usia,b.Usia)).map((item, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{item.Nama}</td>
              <td>{item.Usia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}