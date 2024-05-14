import {useEffect, useState} from "react";
import {Modal, ModalContent, ModalBody, Snippet} from "@nextui-org/react";
import axiosAuth from "../../config/axios";
//-----------------------------------------------------------------------------------------------------------

interface AttendanceSignedModalProps {
  fileName: string,
  isOpen: boolean,
  onOpenChange: () => void
};
//-----------------------------------------------------------------------------------------------------------
export default function AttendanceSignedModal({fileName, isOpen, onOpenChange}: AttendanceSignedModalProps) {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function getData(){
      try{
        const response = await axiosAuth.get(`${import.meta.env.VITE_API_URL}/attendance/${fileName}`, {
          headers:{ 
            'Content-Type': 'application/pdf' 
          },
        });
        console.log(response)
        if(response.status !== 200){
          setError(true)
        }
      }catch(err){
        setError(true)
      }
    }

    getData()
  },[isOpen])
  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size="4xl"
        className="p-4"
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <a target='blank' href={`${import.meta.env.VITE_API_URL}/attendance/${fileName}`} className="text-xs underline text-blue-500">Download</a>
                <div style={{width: '100%', height: '75vh', display: error?  'none' : 'block'}}>
                  <embed
                    src={`${import.meta.env.VITE_API_URL}/attendance/${fileName}`} 
                    className='h-full w-full' 
                  />
                </div>

                <div style={{display: error ? 'block': 'none'}}>
                  <h6 className="mb-3">Apabila anda mengakses dari Ms Teams, <i>Copy</i> dan <i>Paste</i> link berikut ke Browser</h6>
                  <Snippet color='secondary'>{`${import.meta.env.VITE_API_URL}/attendance/${fileName}`}</Snippet>
                </div>
               
                
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
