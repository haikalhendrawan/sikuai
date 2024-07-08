import { Helmet } from "react-helmet-async";
import EventListSection from "../sections/EventList/EventListSection";
import Footer from "../components/Footer";


export default function EventListPage() {
  return (
    <>
      <Helmet>
        <title>Event List </title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-[url('/bg-effect.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-col w-full items-center justify-center gap-2 mb-10">
            <h1 className="text-3xl font-bold">Daftar Kegiatan</h1>
            <p className="text-sm text-slate-500 ">Cek formulir di <a href="https://sikuai.web.id/attForm" target="blank" className="text-sm text-blue-600">https://tinyurl.com/attendanceAmbo</a></p>
        </div>
        <div className="w-full max-w-[800px] p-4">
         <EventListSection />
        </div>
        <Footer />
      </div>
    </>
  )
}