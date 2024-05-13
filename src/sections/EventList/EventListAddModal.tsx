import {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue,  
        Button, DatePicker, Textarea, Select, SelectItem} from "@nextui-org/react";
import {parseDate} from "@internationalized/date";
import { ValueType, AddEventType } from "./types";
//-----------------------------------------------------------------------------------------------------------
const SELECT_UNIT = [
  {label: "Umum", value: "1"},
  {label: "PPA I", value: "2"},
  {label: "PPA II", value: "3"},
  {label: "PAPK", value: "4"},
  {label: "SKKI", value: "5"},
];

interface EventListAddModalProps {
  isOpen: boolean,
  onOpenChange: () => void,
  addEvent(body: AddEventType): Promise<void>
};
//-----------------------------------------------------------------------------------------------------------
export default function EventListAddModal({isOpen, onOpenChange, addEvent}: EventListAddModalProps) {
  const [value, setValue] = useState<ValueType>({
    title: "", 
    date: parseDate(new Date().toISOString().split('T')[0]), 
    uic: ""
  });

  const handleChange = (e: (React.ChangeEvent<HTMLInputElement>) | (DateValue) | React.ChangeEvent<HTMLSelectElement>	 ) => {
    if ('target' in e) {
      setValue((prev) => ({...prev, [e.target.name]: e.target.value}));
    }else{
      setValue((prev) => ({...prev, date: e}));
    }
  };

  const handleSubmit = async() => {
    const body = {
      title: value.title,
      date: value?.date?.toString() || new Date().toISOString().split('T')[0],
      uic: value.uic
    };
    try{
      await addEvent(body);
      onOpenChange();
      handleReset();
    }catch(err){
      console.log(err);
    }
  };

  const handleReset = () => {
    setValue({
      title: "", 
      date: parseDate(new Date().toISOString().split('T')[0]), 
      uic: ""
    });
  };

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
              <ModalHeader className="flex flex-col gap-2">Buat Absensi</ModalHeader>
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
                <Button className='bg-black text-white' onClick={handleSubmit}>
                  Add
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
