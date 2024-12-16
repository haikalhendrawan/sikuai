import {useState, useEffect} from "react";
import { Select, SelectItem} from "@nextui-org/react";
import axiosAuth from "../../config/axios";
import toast, {Toaster} from 'react-hot-toast';
import Iconify from "../../components/Iconify";
import { EmployeeDataTypes } from "./types";
import Eselon from "./Eselon";
import Generasi from "./Generasi";
import Gender from "./Gender";
import Pendidikan from "./Pendidikan";
import Bagan from "./Bagan";
// ------------------------------------------------------------------------------
interface Item{
  id: number,
  text: string,
  unit: string[]
};

interface Data{
  id: number,
  text: string,
  component: JSX.Element
};

const UNIT: Item[] = [
  {id:0, text: "Kanwil + KPPN", unit: ["Kanwil DJPBN Prov. Gorontalo", "KPPN Gorontalo (A1)", "KPPN Marisa (A2)"]},
  {id:1, text: "Kanwil DJPBN Prov. Gorontalo", unit: ["Kanwil DJPBN Prov. Gorontalo"]},
  {id:2, text: "KPPN Gorontalo", unit: ["KPPN Gorontalo (A1)"]},
  {id:3, text: "KPPN Marisa", unit:["KPPN Marisa (A2)"]},
];

// ------------------------------------------------------------------------------
export default function DashboardSection(){
  const [employee, setEmployee] = useState<EmployeeDataTypes[] | []>([]);

  const [unit, setUnit] = useState<Item[] | []>([]);

  const [value, setValue] = useState({
    unit: "0",
    data: "1"
  });

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const selectedUnit = unit[parseInt(value?.unit)]?.unit;

  const employeeByUnit = employee?.filter((item) => selectedUnit?.includes(item?.UnitKerja));

  const unitText = unit[parseInt(value?.unit)]?.text;

  const DATA: Data[] = [
    {id:1, text: "General", component: <Eselon employee={employeeByUnit} unit={unitText}/>},
    {id:2, text: "Generasi/Usia", component: <Generasi employee={employeeByUnit} unit={unitText}/>},
    {id:3, text: "Gender", component: <Gender employee={employeeByUnit} unit={unitText}/>},
    {id:4, text: "Pendidikan", component: <Pendidikan employee={employeeByUnit} unit={unitText}/>},
    {id:5, text: "Bagan Visual", component: <Bagan employee={employeeByUnit} unit={UNIT[parseInt(value?.unit)]?.text}/>},
  ];

  function getAllUnitKerja(employee: EmployeeDataTypes[] | []){
    const allUnit = employee?.map(item => item.UnitKerja);
    const uniqueUnit = [...new Set(allUnit)];
    const uniqueItem = uniqueUnit.map((item, index) => ({id:index+1, text: item, unit: [item]}));
    setUnit([
      {id:0, text: "Kanwil + KPPN", unit: [...uniqueUnit]},
      ...uniqueItem
    ])
  }

  useEffect(() => {
    async function getData(){
      try{
        const response = await axiosAuth.get("/getAllEmployee");
        setEmployee(response.data.rows);
        console.log(response.data.rows)
        console.log(getAllUnitKerja(response.data.rows))
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
        <div className="grid grid-cols-2 gap-4 w-[800px] mb-10">
          <div className="flex flex-row gap-2 items-center">
            <Iconify width={'50px'} icon={"solar:city-bold-duotone"}/>
            <Select
              label="Pilih Unit"
              className="max-w-xs"
              onChange={handleSelectionChange}
              variant='bordered'
              placeholder="Pilih Unit"
              selectedKeys={[value.unit]}
              name="unit"
            >
              {
                unit.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.text}
                  </SelectItem>
                ))
              }

            </Select>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Iconify width={'50px'} icon={"solar:database-bold-duotone"}/>
            <Select
              label="Pilih Data"
              className="max-w-xs"
              onChange={handleSelectionChange}
              variant='bordered'
              placeholder="Pilih Data"
              selectedKeys={[value.data]}
              name="data"
            >
              {
                DATA.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.text}
                  </SelectItem>
                ))
              }

            </Select>
          </div>
         
        </div>
       

        {DATA[parseInt(value.data) - 1]?.component}

        <Toaster />

    </>
  )
}


