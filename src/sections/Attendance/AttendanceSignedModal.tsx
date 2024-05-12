import {useState, useEffect} from "react";
import {Modal, ModalContent, Spinner, ModalBody} from "@nextui-org/react";
import { AttendanceEventBody } from "./types";
//-----------------------------------------------------------------------------------------------------------

interface AttendanceSignedModalProps {
  fileName: string,
  isOpen: boolean,
  onOpenChange: () => void
};
//-----------------------------------------------------------------------------------------------------------
export default function AttendanceSignedModal({fileName, isOpen, onOpenChange}: AttendanceSignedModalProps) {
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
          {(onClose) => (
            <>
              <ModalBody>
                <div style={{width: '100%', height: '90vh'}}>
                  <embed 
                    src={`${import.meta.env.VITE_API_URL}/attendance/${fileName}`} 
                    type="application/pdf" 
                    className='h-full w-full' 
                  />
                </div>
                
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
