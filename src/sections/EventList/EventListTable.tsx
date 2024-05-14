import {useMemo, useCallback, useState, Key } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, 
        TableCell, Pagination, Tooltip, Button, Chip} from "@nextui-org/react";
import EventListTableHeader from "./EventListTableHeader";
import Iconify from "../../components/Iconify";
import {EventTableType} from "./types";
import {SELECT_UNIT} from "./utils";
//-----------------------------------------------------------------------------------------------------------
interface EventListTableProps {
  events: EventTableType[];
  getEvents: () => Promise<void>,
  deleteEvent: (id: string) => Promise<void>,
  closeEvent: (id: string) => Promise<void>,
  onOpenAdd: () => void,
  onOpenEdit: () => void,
  onOpenFile?: () => void,
  onOpenSignedFile?: () => void,
  onOpenDeleteDialog: () => void,
  onOpenSignDialog: () => void,
  setSelectedId: React.Dispatch<React.SetStateAction<string>>,
  getSignedFile?: (fileName: string) => Promise<void>,
}
//-----------------------------------------------------------------------------------------------------------
export default function EventListTable({
  events, 
  onOpenAdd, 
  onOpenEdit,
  onOpenDeleteDialog,
  onOpenSignDialog,
  setSelectedId}: EventListTableProps) {

  const [page, setPage] = useState(1);

  const [filterValue, setFilterValue] = useState<string>("");

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const filteredEvent = events?.filter((row) => row.title.toLowerCase().includes(filterValue.toLowerCase()));

  const onClear = useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[]);

  const handleOpenEditModal = (id: string) => {
    onOpenEdit();
    setSelectedId(id);
  };

  // const handleOpenFileModal = (id: string) => {
  //   onOpenFile();
  //   setSelectedId(id);
  // };

  // const handleOpenSignedFileModal = (fileName: string) => {
  //   onOpenSignedFile();
  //   getSignedFile(fileName)
  // };

  const handleOpenDeleteDialog = (id: string) => {
    onOpenDeleteDialog();
    setSelectedId(id);
  };

  const handleOpenSignDialog = (id: string) => {
    onOpenSignDialog();
    setSelectedId(id);
  };

  const rowsPerPage = 5;

  const pages = events.length>1 && Math.ceil(events.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredEvent.slice(start, end);
  }, [page, filteredEvent]);

  const renderCell = useCallback((events: EventTableType, columnKey: Key) => {
    const cellValue = events[columnKey as keyof EventTableType];
    switch (columnKey) {
      case "key":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {SELECT_UNIT[events.uic as keyof typeof SELECT_UNIT]}
            </p>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col text-center">
            <p className="text-bold text-sm capitalize">{new Date(cellValue).toLocaleDateString('en-GB')}</p>
          </div>
        );
      case "uic":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={cellValue===0 ? "danger" : "success"} size="sm" variant="flat">
            {cellValue===0 ? "Closed" : "Active"}
          </Chip>
        );
      default:
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Edit">
              <Button 
                isIconOnly 
                variant='light' 
                color="warning" 
                aria-label="Edit"
                style={events.status===1 ? {display:'none'} : {}} 
                onClick={() => handleOpenEditModal(events.id)}
              >
                <Iconify icon={"eva:edit-fill"}/>
              </Button>    
            </Tooltip>
            <a 
              href={`/preview/${events.id}`} 
              target="blank" 
              style={{display: events.status===1 ? 'none' : 'block'}}
            >
              <Tooltip content="Preview">
                <Button 
                  isIconOnly 
                  variant='light' 
                  color="default" 
                  aria-label="Preview"
                  style={events.status===1 ? {display:'block'} : {}} 
                >
                  <Iconify icon={"eva:eye-fill"}/>
                </Button>    
              </Tooltip>
            </a>
            <Tooltip content="TTE">
              <Button 
                isIconOnly
                style={events.status===1 ? {display:'none'} : {}} 
                variant='light' 
                color="success" 
                aria-label="TTE"
                onClick={() => handleOpenSignDialog(events.id)} 
              >
                <Iconify icon={"clarity:qr-code-line"}/>
              </Button>    
            </Tooltip>
            <a 
              href={`${import.meta.env.VITE_API_URL}/attendance/${events.file}`} 
              target="blank" 
              style={{display: events.status===0 ? 'none' : 'block'}}
            >
              <Tooltip content="Print">
                <Button 
                  isIconOnly
                  style={events.status===0 ? {display:'none'} : {}} 
                  variant='light' 
                  color="success" 
                  aria-label="Print"
                >
                  <Iconify icon={"eva:printer-fill"}/>
                </Button>
              </Tooltip>
            </a>
            <Tooltip content="Delete">
               <Button
                isDisabled={events.status===1} 
                isIconOnly 
                onClick={() => handleOpenDeleteDialog(events.id)}
                variant='light' 
                color="danger" 
                aria-label="Delete"
              >
                 <Iconify icon={"eva:trash-2-fill"}/>
               </Button>    
            </Tooltip>
          </div>
        );
    }
  }, [events]);

  return (
    <>
        <Table 
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                classNames={{
                  cursor:"bg-black text-white"
                }}
                page={page}
                initialPage={page}
                total={pages || 2}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          topContent={<EventListTableHeader 
                        events={events} 
                        onOpen={onOpenAdd}
                        filterValue={filterValue}
                        onClear={onClear}
                        onSearchChange={onSearchChange}
                      />}
          topContentPlacement = 'outside'
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="key">No</TableColumn>
            <TableColumn key="title" >Kegiatan</TableColumn>
            <TableColumn key="date" className="text-center">Tanggal</TableColumn>
            <TableColumn key="actions" className="text-center">Action</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No event found"}>
            {items?.map((item) => (
              <TableRow key={item.key}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </>

  );
}
