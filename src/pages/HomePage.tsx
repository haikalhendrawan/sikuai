import { Helmet } from "react-helmet-async";
export default function HomePage() {  
  return (
    <>
    <Helmet>
      <title>Home</title>
    </Helmet>

    <div className="flex flex-col items-center justify-center h-screen bg-[url('/tail-gradient.png')] bg-no-repeat bg-cover" >
      <div className="flex flex-col w-full items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">Protected Route</h1>
      </div>
    </div>
    </>
    
  )
}