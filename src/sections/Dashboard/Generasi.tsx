import {useState} from "react";
import {Button} from "@nextui-org/react";
import Iconify from "../../components/Iconify";
import { EmployeeDataTypes } from "./types";
import Chart from "react-apexcharts";

interface GenerasiProps {
  employee: EmployeeDataTypes[] | [],
  unit: string
};

export default function Generasi({employee, unit}: GenerasiProps){
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

  const pieOption = {
    chart: {
      id: "pie-generasi",
    },
    labels: ['Boomer', 'X', 'Milenial', 'Centennial'],
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
    },
  };

  const pieSeries = [amountBoomer, amountX, amountMilenial, amountCentennial];

  const barOption =  {
    chart: {
      id: "bar-generasi"
    },
    colors: [
      function ({dataPointIndex}: any) {
        const colorIndex = ['#7828C8', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB'];
          return colorIndex[dataPointIndex];
        }
    ],
    xaxis: {
      categories: [['Boomer', '(1946-1964)'], ['X', '(1965-1980)'], ['Milenial', '(1981-1996)'], ['Centennial', '(1997-2012)']],
    }
  };

  const barSeries = [
    {
      data: [amountBoomer, amountX, amountMilenial, amountCentennial]
    },
  ];

  const barOptionHorizontal =  {
    chart: {
      id: "bar-generasi-horizontal"
    },
    colors: [
      function ({dataPointIndex}: any) {
        const colorIndex = ['#7828C8', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB'];
          return colorIndex[dataPointIndex];
        }
    ],
    xaxis: {
      categories: ['Usia 20-29', 'Usia 30-39', 'Usia 40-49', 'Usia 50-59', 'Usia 60-69'],
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
  };

  const barSeriesHorizontal = [
    {
      data: [usia2029, usia3039, usia4049, usia5059, usia6069]
    },
  ];

  const tableData = [
    {generasi: 'Boomer', amount: amountBoomer},
    {generasi: 'X', amount: amountX},
    {generasi: 'Milenial', amount: amountMilenial},
    {generasi: 'Centennial', amount: amountCentennial},
  ];

  const tableData2 = [
    {generasi: '20-29', amount: usia2029},
    {generasi: '30-39', amount: usia3039},
    {generasi: '40-49', amount: usia4049},
    {generasi: '50-59', amount: usia5059},
    {generasi: '60-69', amount: usia6069},
  ];

  function getGenerasiText(usia: number){
    if(usia >= boomer.min && usia <= boomer.max){
      return 'Boomer';
    }else if(usia >= x.min && usia <= x.max){
      return 'X';
    }else if(usia >= milenial.min && usia <= milenial.max){
      return 'Milenial';
    }else if(usia >= centennial.min && usia <= centennial.max){
      return 'Centennial';
    }
  };
    

  return(
    <>  
      <div className="grid grid-cols-6">
        <div className="col-span-1 items-center justify-center text-center">
          <h1 className="text-xl"> Jumlah Pegawai </h1>
          <h1 className="text-xl"> {unit} </h1>
          <h6 className="font-bold text-lg">{amount}</h6>
        </div>

        <div className="grid col-span-3 justify-center items-center">
          <Chart 
            options={barOption}
            type="bar"
            series={barSeries}
            width={'500'}
          />
        </div>

        <div className='col-span-2'>
          <Chart 
            options={barOptionHorizontal}
            type="bar"
            series={barSeriesHorizontal}
            width={'500'}
          />
        </div>

        <div className="grid col-span-2 justify-center items-center">
          <Chart 
            options={pieOption}
            series={pieSeries}
            type="donut"
            width={'500'}
          />
        </div>

        <div className="p-10 col-span-2 place-items-start">
          <table className='table-autoborder-collapse w-full text-sm'>
            <thead className="text-xs text-gray-700 uppercase border border-slate-300">
              <tr>
                <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
                <th className="px-6 py-3 border border-slate-300">Generasi</th>
                <th className="px-6 py-3 border border-slate-300">Jumlah</th>
              </tr>
            </thead>
            <tbody >
              {tableData.map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-6 py-4 text-center">{index+1}</td>
                  <td className="px-6 py-4 text-center">{item.generasi}</td>
                  <td className="px-6 py-4 text-center">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 col-span-2 place-items-start">
          <table className='table-autoborder-collapse w-full text-sm'>
            <thead className="text-xs text-gray-700 uppercase border border-slate-300">
              <tr>
                <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
                <th className="px-6 py-3 border border-slate-300">Rentang Usia</th>
                <th className="px-6 py-3 border border-slate-300">Jumlah</th>
              </tr>
            </thead>
            <tbody >
              {tableData2.map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-6 py-4 text-center">{index+1}</td>
                  <td className="px-6 py-4 text-center">{item.generasi}</td>
                  <td className="px-6 py-4 text-center">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 col-span-6 justify-center items-center">
          <table className='table-autoborder-collapse w-full text-sm'>
            <thead className="text-xs text-gray-700 uppercase border border-slate-300">
              <tr>
                <th className="px-6 py-3 border border-slate-300 w-1/5">No</th>
                <th className="px-6 py-3 border border-slate-300">Nama</th>
                <th className="px-6 py-3 border border-slate-300 items-center">
                  <div className="flex flex-row items-center justify-center gap-1">
                    Usia
                    <Button isIconOnly onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')} size="sm" className="bg-transparent">
                     <Iconify icon={order === 'ASC' ? "solar:arrow-up-bold" : "solar:arrow-down-bold"}  />
                    </Button>
                  </div>

                </th>
                <th className="px-6 py-3 border border-slate-300">Generasi</th>
                <th className="px-6 py-3 border border-slate-300">Eselon</th>
              </tr>
            </thead>
            <tbody>
              {employee?.sort((a, b) => handleSortAge(a.Usia,b.Usia)).map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-4 py-2 text-center">{index+1}</td>
                  <td className="px-4 py-2 text-center">{item.Nama}</td>
                  <td className="px-4 py-2 text-center">{item.Usia}</td>
                  <td className="px-4 py-2 text-center">{getGenerasiText(item.Usia)}</td>
                  <td className="px-4 py-2 text-center">{item.Eselon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



      </div>
    </>
  )
}