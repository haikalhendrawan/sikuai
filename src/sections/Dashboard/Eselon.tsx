import { EmployeeDataTypes } from "./types";
import Chart from "react-apexcharts";

interface EselonProps {
  employee: EmployeeDataTypes[] | [],
  unit: string
};

export default function Eselon({employee, unit}: EselonProps) {

  const amount = employee?.length;

  const amountEsII = employee?.filter((item) => item.Eselon.split(".")[0]==="II").length;
  const amountEsIII = employee?.filter((item) => item.Eselon.split(".")[0]==="III").length;
  const amountEsIV = employee?.filter((item) => item.Eselon.split(".")[0]==="IV").length;
  const amountPelaksana = employee?.filter((item) => item.Eselon==="Pelaksana").length;
  const amountFungsional = employee?.filter((item) => item.Eselon.split(".")[0]==="Fungs").length;

  const tableData = [
    {
      "Eselon": "Pelaksana",
      "Jumlah": amountPelaksana
    },
    {
      "Eselon": "Eselon IV",
      "Jumlah": amountEsIV
    },
    {
      "Eselon": "Eselon III",
      "Jumlah": amountEsIII
    },
    {
      "Eselon": "Eselon II",
      "Jumlah": amountEsII
    },
    {
      "Eselon": "Fungsional",
      "Jumlah": amountFungsional
    }
  ];

  const pieOption = {
    chart: {
      id: "pie-eselon",
    },
    labels: ['Pelaksana','Eselon IV', 'Eselon III', 'Eselon II', 'Fungsional',],
    colors: ['#7828C8', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB'],
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
    }
  };
  
  const pieSeries = [amountPelaksana, amountEsIV, amountEsIII, amountEsII, amountFungsional];

  const barOption =  {
    chart: {
      id: "basic-bar"
    },
    colors: [
      function ({dataPointIndex}: any) {
        const colorIndex = ['#7828C8', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB'];
          return colorIndex[dataPointIndex];
        }
    ],
    xaxis: {
      categories: ['Pelaksana', 'Eselon IV', 'Eselon III', 'Eselon II', 'Fungsional']
    }
  };

  const barSeries = [
    {
      data: [amountPelaksana, amountEsIV, amountEsIII, amountEsII, amountFungsional]
    },
  ];

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-1 items-center justify-center text-center">
        <h1 className="text-xl"> Jumlah Pegawai </h1>
        <h1 className="text-xl"> {unit} </h1>
        <h6 className="font-bold text-lg">{amount}</h6>
      </div>

      <div className="col-span-2 justify-center items-center">
        <Chart 
          options={barOption}
          type="bar"
          series={barSeries}
          width={'500'}
        />
      </div>

      <div className="col-span-2 justify-center items-center">
        <Chart 
          options={pieOption}
          series={pieSeries}
          type="donut"
          width={'500'}
        />
      </div>

      <div className="p-10 grid grid-cols-subgrid col-span-2 place-items-start">
        <table className='table-autoborder-collapse w-full text-sm'>
          <thead className="text-xs text-gray-700 uppercase border border-slate-300">
            <tr>
              <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
              <th className="px-6 py-3 border border-slate-300">Eselon</th>
              <th className="px-6 py-3 border border-slate-300">Jumlah</th>
            </tr>
          </thead>
          <tbody >
            {tableData.map((item, index) => (
              <tr key={index} className="border-b border-slate-300">
                <td className="px-6 py-4 text-center">{index+1}</td>
                <td className="px-6 py-4 text-center">{item.Eselon}</td>
                <td className="px-6 py-4 text-center">{item.Jumlah}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-10 col-span-3 justify-center items-center">
        <table className='table-autoborder-collapse w-full text-sm'>
          <thead className="text-xs text-gray-700 uppercase border border-slate-300">
            <tr>
              <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
              <th className="px-6 py-3 border border-slate-300">Nama</th>
              <th className="px-6 py-3 border border-slate-300">Eselon</th>
            </tr>
          </thead>
          <tbody >
            {employee?.sort((a, b) => (('' + a.Eselon).localeCompare(b.Eselon))).map((item, index) => (
              <tr key={index} className="border-b border-slate-300">
                <td className="px-4 py-2 text-center">{index+1}</td>
                <td className="px-4 py-2 text-center">{item.Nama}</td>
                <td className="px-4 py-2 text-center">{item.Eselon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}