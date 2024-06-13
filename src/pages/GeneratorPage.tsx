import { Helmet } from "react-helmet-async";
import GeneratorSection from "../sections/Generator/GeneratorSection";


export default function GeneratorPage() {
  
  return (
    <>
      <Helmet>
        <title>Event List </title>
      </Helmet>

      <GeneratorSection />
    </>
  )
}