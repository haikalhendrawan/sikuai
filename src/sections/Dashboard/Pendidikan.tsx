import { EmployeeDataTypes } from "./types";
import Chart from "react-apexcharts";

interface PendidikanProps{
  employee: EmployeeDataTypes[] | [],
  unit: string
}

export default function Pendidikan({employee, unit}: PendidikanProps){
  const amount = employee?.length;

  const amountSMA = employee?.filter((item) => item.PendidikanTerakhirShrt === "SMA").length;
  const amountDI = employee?.filter((item) => item.PendidikanTerakhirShrt === "D1").length;
  const amountDIII = employee?.filter((item) => item.PendidikanTerakhirShrt === "D3").length;
  const amountS1 = employee?.filter((item) => item.PendidikanTerakhirShrt === "S1").length;
  const amountS2 = employee?.filter((item) => item.PendidikanTerakhirShrt === "S2").length;
  const amountS3 = employee?.filter((item) => item.PendidikanTerakhirShrt === "S3").length;

  const pieOption = {
    chart: {
      id: "pie-pendidikan",
    },
    labels: ['SMA', 'D1', 'D3', 'S1', 'S2', 'S3'],
    colors: ['#7828C8', '#C20E4D', '#F5A524', '#005BC4', '#06B7DB', '#000000'],
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
      formatter: function (val: number, opts: any) {
        console.log(val);
        return  `${(opts.w.config.series[opts.seriesIndex]/amount * 100).toFixed(2)} %`;
      }
    }
  };
  
  const pieSeries = [amountSMA, amountDI, 53, amountS1, amountS2, amountS3];

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
      categories: ['SMA', 'D1', 'D3', 'S1', 'S2', 'S3']
    }
  };

  const barSeries = [
    {
      data: [amountSMA, amountDI, amountDIII, amountS1, amountS2, amountS3]
    },
  ];

  const tableData = [
    {
      pendidikan: 'SMA',
      jumlah: amountSMA
    },
    {
      pendidikan: 'D1',
      jumlah: amountDI
    },
    {
      pendidikan: 'D3',
      jumlah: amountDIII
    },
    {
      pendidikan: 'S1',
      jumlah: amountS1
    },
    {
      pendidikan: 'S2',
      jumlah: amountS2
    },
    {
      pendidikan: 'S3',
      jumlah: amountS3
    },
  ];


  return(
    <>
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
                <th className="px-6 py-3 border border-slate-300">Persen</th>
              </tr>
            </thead>
            <tbody >
              {tableData.map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-6 py-4 text-center">{index+1}</td>
                  <td className="px-6 py-4 text-center">{item.pendidikan}</td>
                  <td className="px-6 py-4 text-center">{item.jumlah}</td>
                  <td className="px-6 py-4 text-center">{(item.jumlah / amount * 100).toFixed(2)}%</td>
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
                <th className="px-6 py-3 border border-slate-300">Pendidikan</th>
                <th className="px-6 py-3 border border-slate-300">Eselon</th>
              </tr>
            </thead>
            <tbody >
              {employee?.sort((a, b) => (('' + a.PendidikanTerakhirShrt).localeCompare(b.PendidikanTerakhirShrt))).map((item, index) => (
                <tr key={index} className="border-b border-slate-300">
                  <td className="px-4 py-2 text-center">{index+1}</td>
                  <td className="px-4 py-2 text-center">{item.Nama}</td>
                  <td className="px-4 py-2 text-center">{item.PendidikanTerakhirShrt}</td>
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