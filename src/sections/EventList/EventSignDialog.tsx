import {useState} from "react";
import {Modal, ModalContent, ModalFooter, ModalHeader, ModalBody , Button} from "@nextui-org/react";
//-----------------------------------------------------------------------------------------------------------

interface EventSignDialogProps {
  isOpen: boolean,
  onOpenChange: () => void,
  getEvents: () => Promise<void>,
  closeEvent: (id: string) => Promise<void>,
  selectedId: string
};
//-----------------------------------------------------------------------------------------------------------
export default function EventSignDialog({isOpen, onOpenChange, closeEvent, getEvents, selectedId}: EventSignDialogProps) {
  const [callingAPI, setCallingAPI] = useState(false);

  const handleClose = async (id: string) => {
    try{
      setCallingAPI(true);
      await closeEvent(id);
      await getEvents();
      onOpenChange();
      setCallingAPI(false);
    }catch(err){
      setCallingAPI(false);
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size="md"
        className="p-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
             <ModalHeader className="flex flex-col gap-1">TTE Kegiatan</ModalHeader>
              <ModalBody>
                <p className='text-slate-500 -mt-5'> 
                  Yakin TTE kegiatan? absensi tidak dapat dilakukan lagi setelah TTE
                </p>
              </ModalBody>

              <ModalFooter className='mt-5'>
                <Button 
                  className='bg-black text-white' 
                  onClick={() => handleClose(selectedId)}
                  isDisabled={callingAPI}
                >
                  Submit
                </Button>
                <Button color="default" onPress={onClose} isDisabled={callingAPI}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
          
        </ModalContent>
      </Modal>
    </>
  );
}
