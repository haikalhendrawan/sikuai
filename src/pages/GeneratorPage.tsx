import { Helmet } from "react-helmet-async";
import GeneratorSection from "../sections/Generator/GeneratorSection";


export default function GeneratorPage() {
  
  return (
    <>
      <Helmet>
        <title>Event List </title>
      </Helmet>

      <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-[url('/bg-effect.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-col w-full items-center justify-center gap-2 mb-10">
          <h1 className="text-3xl font-bold">Generator</h1>          
        </div>
        
        <GeneratorSection />
      </div>
    </>
  )
}