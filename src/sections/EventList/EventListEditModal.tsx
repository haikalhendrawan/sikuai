import {useState, useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue,  
        Button, Input, DatePicker, Textarea, Select, SelectItem} from "@nextui-org/react";
import {parseDate} from "@internationalized/date";
import {EventTableType, EditValueType, EditEventType} from "./types";
import { parseTimeZone } from "./utils";
//-----------------------------------------------------------------------------------------------------------
interface EventListEditModal {
  editEvent: (body: EditEventType) => Promise<void>,
  selectedId: string,
  isOpen: boolean,
  onOpenChange: () => void,
  events: EventTableType[];
};

const SELECT_UNIT = [
  {label: "Umum", value: "1"},
  {label: "PPA I", value: "2"},
  {label: "PPA II", value: "3"},
  {label: "PAPK", value: "4"},
  {label: "SKKI", value: "5"},
];

//-----------------------------------------------------------------------------------------------------------
export default function EventListEditModal({editEvent, selectedId, events, isOpen, onOpenChange}: EventListEditModal) {
  const [value, setValue] = useState<EditValueType>({
    id: "",
    title: "", 
    date: null, 
    uic: "4"
  });

  const handleChange = (e: (React.ChangeEvent<HTMLInputElement>) | (DateValue) | React.ChangeEvent<HTMLSelectElement>	 ) => {
    if ('target' in e) {
      setValue((prev) => ({...prev, [e.target.name]: e.target.value}));
    }else{
      setValue((prev) => ({...prev, date: e}));
    }
  };

  const handleSubmit = async () => {
    const body = {
      id: value.id,
      title: value.title,
      date: value?.date?.toString() || null,
      uic: value.uic
    };
    try{
      await editEvent(body);
      handleReset();
      onOpenChange();
    }catch(err){
      console.log(err);
    }
  };

  const handleReset = () => {
    setValue((prev) => ({
      ...prev,
      id: events?.filter((event) => event.id === selectedId)[0]?.id || '',
      title: events?.filter((event) => event.id === selectedId)[0]?.title || '', 
      date: parseDate(parseTimeZone(events?.filter((event) => event.id === selectedId)[0]?.date) || new Date().toISOString().split('T')[0]),
      uic: events?.filter((event) => event.id === selectedId)[0]?.uic.toString() || ''
    }))
  };

  useEffect(() => {
    if(events.length>0){
      setValue((prev) => ({
        ...prev,
        id: events?.filter((event) => event.id === selectedId)[0]?.id || '',
        title: events?.filter((event) => event.id === selectedId)[0]?.title || '', 
        date: parseDate(parseTimeZone(events?.filter((event) => event.id === selectedId)[0]?.date) || new Date().toISOString().split('T')[0]),
        uic: events?.filter((event) => event.id === selectedId)[0]?.uic.toString() || ''
      }))
    };
  }, [events, selectedId]);

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
              <ModalHeader className="flex flex-col gap-2">Edit Detail Kegiatan</ModalHeader>
              <ModalBody>
                <Textarea
                  name="title"
                  spellCheck={false}
                  label="Nama Kegiatan"
                  value={value.title}
                  onChange={(e) => handleChange(e)}
                  variant="bordered"
                  // placeholder="Enter your description"
                  className="max-w-xl"
                />
                <DatePicker 
                  name="date"
                  label="Tanggal"
                  variant="bordered"
                  value={value.date} 
                  className="max-w-xl"
                  onChange={(e) => handleChange(e)}
                  popoverProps={{placement: "right-end"}}
                />
                <Select
                  name="uic"
                  label="UIC"
                  variant="bordered" 
                  className="max-w-xl"
                  selectedKeys={value.uic}
                  value={value.uic}
                  onChange={(e) => handleChange(e)}
                >
                  {SELECT_UNIT.map((row) => (
                    <SelectItem key={row.value} value={row.value}>
                      {row.label}
                    </SelectItem>
                  ))}
                </Select>
                
              </ModalBody>
              <ModalFooter className="mr-4">
                <Button color="warning" onClick={handleSubmit}>
                  Edit
                </Button>
                <Button color="default" onClick={handleReset}>
                  Reset
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
