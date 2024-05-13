import {Modal, ModalContent, ModalFooter, ModalHeader, ModalBody , Button} from "@nextui-org/react";
//-----------------------------------------------------------------------------------------------------------

interface EventTableDialogProps {
  isOpen: boolean,
  onOpenChange: () => void,
  getEvents: () => Promise<void>,
  deleteEvent: (id: string) => Promise<void>,
  selectedId: string
};
//-----------------------------------------------------------------------------------------------------------
export default function EventTableDialog({isOpen, onOpenChange, deleteEvent, getEvents, selectedId}: EventTableDialogProps) {
  const handleDelete = async (id: string) => {
    await deleteEvent(id);
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
             <ModalHeader className="flex flex-col gap-1">Hapus Kegiatan</ModalHeader>
              <ModalBody>
                <p className='text-slate-500 -mt-5'> 
                  Yakin hapus kegiatan?
                </p>
              </ModalBody>

              <ModalFooter className='mt-5'>
                <Button color="danger"  onClick={() => handleDelete(selectedId)}>
                  Delete
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
