import {useState, useEffect, Key} from "react";
import {Card, CardHeader, CardBody, CardFooter, Select, SelectItem} from "@nextui-org/react";
import axiosAuth from "../../config/axios";
import toast from 'react-hot-toast';
import { EmployeeDataTypes } from "./types";
import Chart from "react-apexcharts";
import JumlahPelaksana from "./JumlahPelaksana";

const option = {
  chart: {
    id: "basic-bar"
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
  },
  labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
};

const series = [44, 55, 41, 17, 15];

interface item{
  id: number,
  text: string,
  value: string[]
};

const UNIT: item[] = [
  {id:0, text: "Kanwil + KPPN", value: ["Kanwil DJPBN Prov. Sumatera Barat", "KPPN Padang (A1)", "KPPN Bukittinggi (A1)", "KPPN Solok (A1)","KPPN Lubuk Sikaping (A2)", "KPPN Sijunjung (A2)", "KPPN Painan (A2)"]},
  {id:1, text: "Kanwil DJPBN Prov. Sumatera Barat", value: ["Kanwil DJPBN Prov. Sumatera Barat"]},
  {id:2, text: "KPPN Padang", value: ["KPPN Padang (A1)"]},
  {id:3, text: "KPPN Bukittinggi", value:["KPPN Bukittinggi (A1)"]},
  {id:4, text: "KPPN Solok", value: ["KPPN Solok (A1)"]},
  {id:5, text: "KPPN Lubuk Sikaping", value: ["KPPN Lubuk Sikaping (A2)"]},
  {id:6, text: "KPPN Sijunjung", value: ["KPPN Sijunjung (A2)"]},
  {id:7, text: "KPPN Painan", value: ["KPPN Painan (A2)"]},
];


export default function DashboardSection(){
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  const [selectedUnit, setSelectedUnit] = useState<string[]>(["Kanwil DJPBN Prov. Sumatera Barat", "KPPN Padang (A1)", "KPPN Bukittinggi (A1)", "KPPN Solok (A1)","KPPN Lubuk Sikaping (A2)", "KPPN Sijunjung (A2)", "KPPN Painan (A2)"]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(UNIT[parseInt(e.target.value)]?.value);
  };

  useEffect(() => {
    async function getData(){
      try{
        const response = await axiosAuth.get("/getAllEmployee");
        setEmployee(response.data.rows);
        console.log(response.data.rows)
      }catch(err: any){
        if(err.response){
          console.log(err)
          return toast.error(err.response.data.message, {
            position: 'top-right',
            className:'text-sm'
          });
        }else{
          console.log(err)
          return toast.error(err.message, {
            position: 'top-right',
            className:'text-sm'
          });
        }
      }
    };

    getData();
  }, []);

  return(
    <>

        <Select
          key={0}
          label="Pilih Unit"
          className="max-w-xs"
          value={selectedUnit}
          onChange={(e) => handleChange(e)}
        >
          {
            UNIT.map((unit, index) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.text}
              </SelectItem>
            ))
          }

        </Select>

      <JumlahPelaksana 
        employee={employee.filter((item) => selectedUnit?.includes(item.UnitKerja))} 
      />

      <Chart 
        options={option}
        series={series}
        type="donut"
        width="500"
      />

    </>
  )
}