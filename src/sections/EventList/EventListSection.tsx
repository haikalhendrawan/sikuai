import EventListTable from "./EventListTable";
import {useState, useEffect} from "react";
import {useDisclosure} from "@nextui-org/react";
import axiosAuth from "../../config/axios";
import EventListAddModal from "./EventListAddModal";
import EventListEditModal from "./EventListEditModal";
import AttendancePreviewModal from "../Attendance/AttendancePreviewModal";
import AttendanceSignedModal from "../Attendance/AttendanceSignedModal";
import EventTableDialog from "./EventTableDialog";
import EventSignDialog from "./EventSignDialog";
import { AddEventType, EditEventType, EventType } from "./types";

//-----------------------------------------------------------------------------------------------------------
export default function EventListSection(){
  const [events, setEvents] = useState([]);

  const [fileLink, setFileLink] = useState<string>('');

  const {isOpen, onOpen, onOpenChange} = useDisclosure(); //utk add modal

  const {isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2} = useDisclosure(); //utk edit modal

  const {isOpen: isOpen3, onOpen: onOpen3, onOpenChange: onOpenChange3} = useDisclosure(); //utk file modal

  const {isOpen: isOpen4, onOpen: onOpen4, onOpenChange: onOpenChange4} = useDisclosure(); //utk signed file modal

  const {isOpen: isOpen5, onOpen: onOpen5, onOpenChange: onOpenChange5} = useDisclosure(); //utk delete confirm modal

  const {isOpen: isOpen6, onOpen: onOpen6, onOpenChange: onOpenChange6} = useDisclosure(); //utk tte confirm modal

  const [selectedId, setSelectedId] = useState<string>('');

  async function getEvents() {
    try{
      const response = await axiosAuth.get("/getAllEvent");
      const mapped = response.data.rows.map((event: EventType, index: number) => ({
        key: index+1,
        ...event,
      }));
      setEvents(mapped);
     
    }catch(err){
      throw err
    }
  };

  async function addEvent(body: AddEventType){
    try{
      const response = await axiosAuth.post(`/addEvent`, body);
      getEvents();
    }catch(err: any){
      throw err
    }
  };

  async function editEvent(body: EditEventType){
    try{
      const response = await axiosAuth.post(`/editEvent`, body);
      getEvents();
    }catch(err: any){
      throw err
    }
  };

  async function deleteEvent(id: string){
    try{
      const response = await axiosAuth.post(`/deleteEvent`, {id: id});
    }catch(err: any){
      throw err
    }
  };

  async function closeEvent(id: string){
    try{
      const response = await axiosAuth.post("/closeEvent",{
        id: id
      })
      console.log(response)
    }catch(err: any){
      throw err
    }
  };

  async function getSignedFile(fileName: string){
    try{
      setFileLink(fileName)
    }catch(err: any){
      throw err
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return(
    <>

      {/* <Snackbar/> */}
      <EventListTable 
        events={events} 
        getEvents={getEvents} 
        deleteEvent={deleteEvent}
        closeEvent={closeEvent}
        onOpenAdd={onOpen}
        onOpenEdit={onOpen2}
        onOpenFile={onOpen3}
        onOpenSignedFile={onOpen4}
        onOpenDeleteDialog={onOpen5}
        onOpenSignDialog={onOpen6}
        setSelectedId={setSelectedId}
        getSignedFile={getSignedFile}
      />
      <EventListAddModal
        addEvent={addEvent} 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
      />
      <EventListEditModal
        editEvent={editEvent}
        selectedId={selectedId}
        events={events} 
        isOpen={isOpen2}
        onOpenChange={onOpenChange2}
      />
      <AttendancePreviewModal
        editId={selectedId}
        isOpen={isOpen3}
        onOpenChange={onOpenChange3}
      />

      <AttendanceSignedModal
        fileName={fileLink}
        isOpen={isOpen4}
        onOpenChange={onOpenChange4}
      />

      <EventTableDialog 
        isOpen={isOpen5} 
        onOpenChange={onOpenChange5} 
        deleteEvent={() => deleteEvent(selectedId)}
        getEvents={getEvents}
        selectedId={selectedId}
      />

      <EventSignDialog
        isOpen={isOpen6}
        onOpenChange={onOpenChange6}
        closeEvent={() => closeEvent(selectedId)}
        getEvents={getEvents}
        selectedId={selectedId}
      />
    </>
  )
} 