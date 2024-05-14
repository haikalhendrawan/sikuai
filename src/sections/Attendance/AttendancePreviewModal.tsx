import {useState, useEffect} from "react";
import {Modal, ModalContent,  ModalBody, Spinner} from "@nextui-org/react";
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
    const now = new Date().getTime();
    try{
      setIsLoading(true);
      const response = await axiosAuth.post("/getAttendanceByEvent?now=" + now , {eventId: editId});
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
    getData();
  },[editId, isOpen])
  
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
                {isLoading?<Spinner />:<AttendanceReport attendance={attendance}/>}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
