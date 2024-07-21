import { EmployeeDataTypes } from "./types";
import Chart from "react-apexcharts";

interface GenderProps {
  employee: EmployeeDataTypes[] | [],
  unit: string
};

export default function Gender({employee, unit}: GenderProps){
  const amount = employee?.length;

  const amountL = employee?.filter((item) => item.Sex === "L").length;
  const amountP = employee?.filter((item) => item.Sex === "P").length;

  const amountLPelaksana = employee?.filter((item) => item.Sex === "L" && item.Eselon.toLowerCase() === "pelaksana").length;
  const amountPPelaksana = employee?.filter((item) => item.Sex === "P" && item.Eselon.toLowerCase() === "pelaksana").length;

  const amountLPejabat = employee?.filter((item) => item.Sex === "L" && item.Eselon.toLowerCase() !== "pelaksana").length;
  const amountPPejabat = employee?.filter((item) => item.Sex === "P" && item.Eselon.toLowerCase() !== "pelaksana").length;

  const pieOption = {
    chart: {
      id: "pie-eselon",
    },
    labels: ['Pria', 'Wanita'],
    colors: ['#005BC4', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB'],
    plotOptions: {
      pie:{ 
        donut:{
          labels:{
            show: true,
            name:{
              show: true,
            }
          },
          total: {
            show: false,
            showAlways: false,
            label: 'Total',
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            color: '#373d3f',
            formatter: function (w: any) {
              return w.globals.seriesTotals.reduce((a: any, b: any) => {
                return a + b
              }, 0)
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(2) + '%';
      }
    }
  };
  
  const pieSeries = [amountL, amountP];

  const tableData = [
    {
      gender: "Pria",
      jumlah: amountL
    },
    {
      gender: "Wanita",
      jumlah: amountP
    }
  ];

  const tableData2 = [
    {
      gender: "Pria",
      jumlah: amountLPejabat
    },
    {
      gender: "Wanita",
      jumlah: amountPPejabat
    }
  ];

  const pieOptionPejabat = {
    chart: {
      id: "pie-eselon",
    },
    labels: ['Pria', 'Wanita'],
    colors: ['#005BC4', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB'],
    plotOptions: {
      pie:{ 
        donut:{
          labels:{
            show: true,
            name:{
              show: true,
            }
          },
          total: {
            show: false,
            showAlways: false,
            label: 'Total',
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            color: '#373d3f',
            formatter: function (w: any) {
              return w.globals.seriesTotals.reduce((a: any, b: any) => {
                return a + b
              }, 0)
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(2) + '%';
      }
    }
  };

  const pieSeriesPejabat = [amountLPejabat, amountPPejabat];

  const pieSeriesPelaksana = [amountLPelaksana, amountPPelaksana];

  const tableData3 = [
    {
      gender: "Pria",
      jumlah: amountLPelaksana
    },
    {
      gender: "Wanita",
      jumlah: amountPPelaksana
    }
  ];

  return(
    <>
      <div className="grid grid-cols-5">
        <div className="col-span-1 items-center justify-center text-center">
          <h1 className="text-xl"> Jumlah Pegawai </h1>
          <h1 className="text-xl"> {unit} </h1>
          <h6 className="font-bold text-lg">{amount}</h6>
        </div>

        <div className="col-span-2 justify-center items-start">
          <h6 className="text-md text-center text-gray-700 mb-2">Proporsi Gender Pegawai</h6>
          <table className='table-autoborder-collapse w-full text-sm'>
            <thead className="text-xs text-gray-700 uppercase border border-slate-300">
              <tr>
                <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
                <th className="px-6 py-3 border border-slate-300">Jenis Kelamin</th>
                <th className="px-6 py-3 border border-slate-300">Jumlah Pegawai</th>
              </tr>
            </thead>
            <tbody >
              {tableData.map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-6 py-4 text-center">{index+1}</td>
                  <td className="px-6 py-4 text-center">{item.gender}</td>
                  <td className="px-6 py-4 text-center">{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 justify-center items-center">
          <Chart 
            options={pieOption}
            series={pieSeries}
            type="donut"
            width={'500'}
          />
        </div>

        <div className="col-span-1 items-center justify-center text-center">

        </div>

        <div className="col-span-2 justify-center items-start">
          <h6 className="text-md text-center text-gray-700 mb-2">Proporsi Gender Pejabat (Strk + JF)</h6>
          <table className='table-autoborder-collapse w-full text-sm'>
            <thead className="text-xs text-gray-700 uppercase border border-slate-300">
              <tr>
                <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
                <th className="px-6 py-3 border border-slate-300">Jenis Kelamin</th>
                <th className="px-6 py-3 border border-slate-300">Jumlah Pegawai (Pejabat)</th>
              </tr>
            </thead>
            <tbody >
              {tableData2.map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-6 py-4 text-center">{index+1}</td>
                  <td className="px-6 py-4 text-center">{item.gender}</td>
                  <td className="px-6 py-4 text-center">{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid col-span-2 justify-center items-center">
          <Chart 
            options={pieOptionPejabat}
            series={pieSeriesPejabat}
            type="donut"
            width={'500'}
          />
        </div>

        <div className="col-span-1 items-center justify-center text-center">

        </div>

        <div className="col-span-2 justify-center items-start">
          <h6 className="text-md text-center text-gray-700 mb-2">Proporsi Gender Pelaksana</h6>
          <table className='table-autoborder-collapse w-full text-sm'>
            <thead className="text-xs text-gray-700 uppercase border border-slate-300">
              <tr>
                <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
                <th className="px-6 py-3 border border-slate-300">Jenis Kelamin</th>
                <th className="px-6 py-3 border border-slate-300">Jumlah Pegawai (Pelaksana)</th>
              </tr>
            </thead>
            <tbody >
              {tableData3.map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-6 py-4 text-center">{index+1}</td>
                  <td className="px-6 py-4 text-center">{item.gender}</td>
                  <td className="px-6 py-4 text-center">{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid col-span-2 justify-center items-center">
          <Chart 
            options={pieOption}
            series={pieSeriesPelaksana}
            type="donut"
            width={'500'}
          />
        </div>


      </div>
    </>
  )




}