import { EmployeeDataTypes } from "./types";

interface GenderProps {
  employee: EmployeeDataTypes[] | [],
  unit: string
};


export default function Bagan({employee, unit}: GenderProps) {
  const esIII = employee?.filter(item => item.UnitEselonIV).map((item) => item.UnitEselonIII);
  const esIIISet = [...new Set(esIII)];
  const esIV = employee?.filter(item => item.UnitEselonIV).map((item) => item.UnitEselonIV);
  const esIVSet = [...new Set(esIV)];
  const pelaksana = employee?.filter((item) => item.Eselon==="Pelaksana");
  const fungsional = employee?.filter((item) => item.Eselon.split(".")[0]==="Fungs").map((item) => item.Jabatan);
  const fungsionalSet = [...new Set(fungsional)];

  function getUniqueScopedEsIV(esIII: string){
    return employee?.filter(item => item.UnitEselonIV && item.UnitEselonIII === esIII).map((item) => item.UnitEselonIV);
  };
  
  const baganKPPN = (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row gap-4 justify-end ">
        <BoxEsIII employee={employee?.find(item => item.Eselon.split(".")[0]==="III")} />
      </div>
      <div className="flex flex-row w-full gap-4 mt-5 justify-end items-end">
          {fungsionalSet.map((fsItem, index) => (<BoxFungs key={index} employee={employee?.find(item =>item.Eselon.split(".")[0]==="Fungs" && item.Jabatan === fsItem)} esItem={fsItem}/>) )}
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {
          esIVSet.map((esItem, esIndex) => (
            <div key={esIndex}>
              <BoxEsIV employee={employee?.find(item => item.UnitEselonIV === esItem && item.Eselon.split(".")[0]==="IV")} esItem={esItem}/>
              <div className="grid grid-cols-2">
                {pelaksana.filter((p) => p.UnitEselonIV === esItem).map((pelaksanaItem, pelaksanaIndex) => (
                  <BoxPelaksana key={`${esIndex}-${pelaksanaIndex}`} employee={pelaksanaItem} />
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );

  const baganKanwil= 
    <>
      <BoxEsII employee={employee?.find(item => item.Eselon.split(".")[0]==="II")} />
      <div className="flex flex-row w-full gap-4 mt-5 justify-end items-end">
        {fungsionalSet.map((fsItem, index) => (<BoxFungs key={index} employee={employee?.find(item =>item.Eselon.split(".")[0]==="Fungs" && item.Jabatan === fsItem)} esItem={fsItem}/>) )}
      </div>
      {esIIISet?.map((es3Item, es3Index) => (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row gap-4 justify-end mt-4">
            <BoxEsIII key={es3Index} employee={employee?.find(item => item.UnitEselonIII === es3Item && item.Eselon.split(".")[0]==="III" )} />
          </div>
          
          <div className="grid grid-cols-5 gap-4 justify-center">
            {
              [... new Set(getUniqueScopedEsIV(es3Item))].map((esItem, esIndex) => (
                <div key={esIndex}>
                  <BoxEsIV employee={employee?.find(item => (item.UnitEselonIV === esItem && item.Eselon.split(".")[0]==="IV"))} esItem={esItem}/>
                  <div className="grid grid-cols-2">
                    {pelaksana.filter((p) => p.UnitEselonIV === esItem).map((pelaksanaItem, pelaksanaIndex) => (
                      <BoxPelaksana key={`${esIndex}-${pelaksanaIndex}`} employee={pelaksanaItem} />
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        ))} 

    </>
  ;

  const baganKanwilKPPN = <h1>Silahkan pilih Unit Kanwil atau KPPN</h1>;

  return unit === "Kanwil + KPPN"? baganKanwilKPPN : unit === "Kanwil DJPBN Prov. Sumatera Barat"? baganKanwil : baganKPPN;
}

function BoxEsII({employee, esItem}: {employee: EmployeeDataTypes | undefined, esItem?: string}){
  const jabatan = employee?.Jabatan || esItem;
  const nama = employee?.Nama;
  const genderSymbol = employee?.Sex === "L" ? "♂" : "♀";
  return (
    <div className="h-[100px] w-[450px] bg-black items-center justify-center text-center align-middle px-1">
      <p className="text-sm text-white ">{jabatan}</p><br/>
      <p className="text-sm text-white">{nama}{' '}{genderSymbol}</p>
    </div>
  )
}

function BoxEsIII({employee, esItem}: {employee: EmployeeDataTypes | undefined, esItem?: string}){
  const jabatan = employee?.Jabatan || esItem;
  const nama = employee?.Nama;
  const genderSymbol = employee?.Sex === "L" ? "♂" : "♀";
  return (
    <div className="h-[100px] w-[450px] bg-green-700 items-center justify-center text-center align-middle px-1">
      <p className="text-sm text-white ">{jabatan}</p><br/>
      <p className="text-sm text-white">{nama}{' '}{genderSymbol}</p>
    </div>
  )
}

function BoxEsIV({employee, esItem}: {employee: EmployeeDataTypes | undefined, esItem: string}) {
  const jabatan = employee?.Jabatan || esItem;
  const nama = employee?.Nama;
  const genderSymbol = employee?.Sex === "L" ? "♂" : "♀";
  return (
    <div className="h-[150px] w-[290px] bg-purple-500 items-center justify-center text-center align-middle px-1">
      <p className="text-sm text-white ">{jabatan}</p><br/>
      <p className="text-sm text-white">{nama}{' '}{genderSymbol}</p>
    </div>
  )
}

function BoxFungs({employee, esItem}: {employee: EmployeeDataTypes | undefined, esItem: string}) {
  const jabatan = employee?.Jabatan || esItem;
  const nama = employee?.Nama;
  const genderSymbol = employee?.Sex === "L" ? "♂" : "♀";
  return (
    <div className="h-[150px] w-[290px] bg-red-500 items-center justify-center text-center align-middle px-1">
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
