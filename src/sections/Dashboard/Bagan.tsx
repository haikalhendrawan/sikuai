import { EmployeeDataTypes } from "./types";

interface GenderProps {
  employee: EmployeeDataTypes[] | [],
  unit: string
};


export default function Bagan({employee, unit}: GenderProps) {
  const amount = employee?.length;

  const boxPelaksana = <div className="h-[100px] w-[100px] bg-amber-400"></div>;

  const esII = employee?.filter((item) => item.Eselon.split(".")[0]==="II");
  const esIII = employee?.filter((item) => item.Eselon.split(".")[0]==="III");
  const esIV = employee?.filter(item => item.UnitEselonIV).map((item) => item.UnitEselonIV);
  const esIVSet = [...new Set(esIV)];
  const pelaksana = employee?.filter((item) => item.Eselon==="Pelaksana");
  const fungsional = employee?.filter((item) => item.Eselon.split(".")[0]==="Fungs");

  const amountEsII = employee?.filter((item) => item.Eselon.split(".")[0]==="II").length;
  const amountEsIII = employee?.filter((item) => item.Eselon.split(".")[0]==="III").length;
  const amountEsIV = employee?.filter((item) => item.Eselon.split(".")[0]==="IV").length;
  const amountPelaksana = employee?.filter((item) => item.Eselon==="Pelaksana").length;
  const amountFungsional = employee?.filter((item) => item.Eselon.split(".")[0]==="Fungs").length; 

  return (
    <div className="grid grid-cols-5 gap-2">
      {esIVSet.map((esItem, esIndex) => (
        <div key={esIndex}>
          <BoxEsIV employee={employee?.find(item => item.UnitEselonIV === esItem && item.Eselon.split(".")[0]==="IV")} esItem={esItem}/>
          <div className="grid grid-cols-2">
            {pelaksana.filter((p) => p.UnitEselonIV === esItem).map((pelaksanaItem, pelaksanaIndex) => (
              <BoxPelaksana key={`${esIndex}-${pelaksanaIndex}`} employee={pelaksanaItem} />
            ))}
          </div>
          
        </div>
      ))}
    </div>
  )
}


function BoxEsIV({employee, esItem}: {employee: EmployeeDataTypes | undefined, esItem: string}) {
  const jabatan = employee?.Jabatan || esItem;
  const nama = employee?.Nama;
  const genderSymbol = employee?.Sex === "L" ? "♂" : "♀";
  return (
    <div className="h-[150px] w-[300px] bg-purple-500 items-center justify-center text-center align-middle px-1">
      <p className="text-sm text-white ">{jabatan}</p><br/>
      <p className="text-sm text-white">{nama}{' '}{genderSymbol}</p>
    </div>
  )
}


function BoxPelaksana({employee}: {employee: EmployeeDataTypes}){
  const jabatan = employee?.Jabatan;
  const nama = employee.Nama;
  const genderSymbol = employee?.Sex === "L" ? "♂" : "♀";
  return (
    <div className="h-[150px] w-[150px] bg-amber-400 items-center justify-center text-center align-middle px-1 border border-slate-300">
      <p className="text-xs text-black ">{jabatan}</p><br/>
      <p className="text-xs text-slate-800">{nama}{' '}{genderSymbol}</p>
    </div>
  )
}
