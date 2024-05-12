import {useState, useEffect} from "react";
import {Modal, ModalContent, Spinner, ModalBody} from "@nextui-org/react";
import AttendanceReport from "../PDF/AttendanceReport";
import axiosAuth from "../../config/axios";
import { AttendanceEventBody } from "./types";
//-----------------------------------------------------------------------------------------------------------
interface AttendancePreviewModalProps {
  editId: string,
  isOpen: boolean,
  onOpenChange: () => void
};
//-----------------------------------------------------------------------------------------------------------
export default function AttendancePreviewModal({editId, isOpen, onOpenChange}: AttendancePreviewModalProps) {
  const [attendance, setAttendance] = useState<AttendanceEventBody[] | []>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getData(){
    try{
      setIsLoading(true);
      const response = await axiosAuth.post("/getAttendanceByEvent", {eventId: editId});
      setAttendance(response.data.rows);
      setIsLoading(false);
    }catch(err){
      setIsLoading(false);
      console.log(err)
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(editId){
      getData();
    }

  },[editId])
  
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
                {isLoading?<Spinner />:<AttendanceReport attendance={attendance}/>}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
