import UploadDataSection from "../sections/UploadData/UploadDataSection"

export default function UpdatePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('/bg-effect.png')] bg-no-repeat bg-cover" >
        <div className="flex flex-col w-full items-center justify-center gap-2 mb-10">
          <UploadDataSection/>
        </div>
      </div>
    </>
  )
}
