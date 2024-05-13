import { useMemo } from "react";
import { Input, Button} from "@nextui-org/react";
import Iconify from "../../components/Iconify";
import {EventTableType} from "./types";

interface EventListTableHeaderProps {
  events: EventTableType[]; 
  onOpen: () => void;
  filterValue: string;
  onClear: () => void;
  onSearchChange: (value?: string) => void;
}

export default function EventListTableHeader({events, onOpen, filterValue, onClear, onSearchChange}: EventListTableHeaderProps) {
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<Iconify icon={"eva:search-fill"} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button 
              className="bg-black text-white" 
              endContent={<Iconify icon={"eva:plus-fill"}/>}
              onClick={onOpen}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total: {events.length} kegiatan</span>
        </div>
      </div>
    );
  }, [events, filterValue, onClear, onOpen, onSearchChange]);

  return(topContent)
}