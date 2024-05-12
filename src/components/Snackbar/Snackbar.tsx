import Iconify from "../Iconify"

export default function Snackbar(){
  return(
    <>
      <div 
        id="toast-simple" 
        className='
          flex items-center w-full max-w-xs 
          p-4 space-x-4 rtl:space-x-reverse text-gray-500 
          bg-white divide-x rtl:divide-x-reverse divide-gray-200 
          rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 
          space-x dark:bg-gray-800 fixed top-5 right-5' 
        role="alert"
      >
        <Iconify icon={"eva:checkmark-circle-2-fill"} className="bg-green-500"/>
        <div className="ps-4 text-sm font-normal">Message sent successfully.</div>
      </div>
    </>
  )
}