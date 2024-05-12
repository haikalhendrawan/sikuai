import {useState, useEffect} from "react";
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
  const handleClose = async (id: string) => {
    await closeEvent(id);
    await getEvents();
    onOpenChange();
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
                  Yakin TTE kegiatan? absensi akan tidak dapat dilakukan lagi pada kegiatan ini
                </p>
              </ModalBody>

              <ModalFooter className='mt-5'>
                <Button className='bg-black text-white' onClick={() => handleClose(selectedId)}>
                  Submit
                </Button>
                <Button color="default" onPress={onClose}>
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
