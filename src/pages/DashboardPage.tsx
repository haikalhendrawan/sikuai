import { Helmet} from "react-helmet-async";
import Footer from "../components/Footer";
import DashboardSection from "../sections/Dashboard/DashboardSection";


export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      
      <div className="flex flex-col items-center justify-center bg-[url('/bg-effect.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-col w-full items-center justify-center gap-2 mb-10 mt-5">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex flex-col w-full p-8 items-center justify-center">
          <DashboardSection />
        </div>
        <Footer />
      </div>
    </>
  )
}