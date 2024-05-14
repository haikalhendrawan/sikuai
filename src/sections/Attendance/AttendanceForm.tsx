import {useState} from "react";
import {Input, Button, Select, SelectItem} from "@nextui-org/react";
import { AddAttendanceBody, AttendanceFormTypes, AddAttendanceError,
  nameSchema, emailSchema, identifierSchema, unitSchema, idSchema} from "./types";
//-----------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------
export default function AttendanceForm({todayEvents, addAttendance}: AttendanceFormTypes) {
  const [value, setValue] = useState<AddAttendanceBody>({
    id: '',
    name: '',
    email: '',
    identifier: '',
    unit: '',
  });

  const [error, setError] = useState<AddAttendanceError>({
    id: false,
    name: false,
    email: false,
    identifier: false,
    unit: false,
  });

  const [errorMessage, setErrorMessage] = useState<AddAttendanceBody>({
    id:'',
    name: '',
    email: '',
    identifier: '',
    unit: '',
  })

  const handleChange = (e: (React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>)) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError((prev) => ({
      ...prev,
      [e.target.name]: false
    }))
  };

  const handleSubmit = async() => {
    try{
      const isValidId = idSchema.safeParse(value.id).success;
      const isValidName = nameSchema.safeParse(value.name).success;
      const isValidEmail = emailSchema.safeParse(value.email).success;
      const isValidIdentifier = identifierSchema.safeParse(value.identifier).success;
      const isValidUnit = unitSchema.safeParse(value.unit).success;

      if(!isValidId || !isValidName || !isValidEmail || !isValidIdentifier || !isValidUnit){
        if(!isValidId){
          setError((prev) => ({...prev, id: true}));
          setErrorMessage((prev) => ({...prev, id: 'Invalid ID'}));
        }
        if(!isValidName){
          setError((prev) => ({...prev, name: true}));
          setErrorMessage((prev) => ({...prev, name: 'Invalid Name'}));
        }
        if(!isValidEmail){
          setError((prev) => ({...prev, email: true}));
          setErrorMessage((prev) => ({...prev, email: 'Invalid Email'}));
        }

        return
      }

      await addAttendance(value);
    }catch(err){
      console.log(err)
    }
  };

  return (
    <>
      <div className="flex flex-col w-full items-center justify-center gap-8">
        <div className="flex flex-col w-full items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">Attendance Form</h1>
          <p className="text-sm text-slate-500">Kanwil DJPb Prov. Sumatera Barat</p>
        </div>

        <Select
          name="id"
          label="Acara"
          variant="bordered"
          isRequired  
          className="max-w-xl px-2"
          labelPlacement="outside"
          placeholder="Pilih kegiatan yang anda hadiri"
          isInvalid={error.id}
          errorMessage={errorMessage.id}
          // selectedKeys={value.id}
          value={value.id}
          onChange={(e) => handleChange(e)}
        >
          {todayEvents?.map((row) => (
            <SelectItem 
              key={row.id} 
              value={row.id}
              endContent={<span className="text-slate-500">{new Date(row.date).toLocaleDateString('en-GB')}</span>}>
              {row.title}
            </SelectItem>
          ))}
        </Select>

        <Input
          name='name'
          label="Nama"
          size="md"
          isRequired  
          variant="bordered"
          className="max-w-xl px-2"
          value={value.name}
          isInvalid={error.name}
          errorMessage={errorMessage.name}
          labelPlacement="outside"
          placeholder="Masukkan nama lengkap anda"
          onChange={handleChange}
        />

        <Input
          name='email'
          label="Email"
          isRequired 
          labelPlacement="outside"
          placeholder="Masukkan email yang valid"
          type="email"
          errorMessage={errorMessage.email}
          isInvalid={error.email}
          variant="bordered"
          className="max-w-xl px-2"
          value={value.email}
          onChange={handleChange}
        />

        <Input
          name='identifier'
          label="NIP"
          labelPlacement="outside"
          placeholder="Masukan NIP anda"
          description="Silahkan masukan nomor NIK apabila bukan berasal dari pemerintahan"
          variant="bordered"
          className="max-w-xl px-2"
          value={value.identifier}
          onChange={handleChange}
        />

        <Input
          name='unit'
          label="Unit"
          labelPlacement="outside"
          placeholder="Nama instansi tempat anda bekerja/usaha"
          variant="bordered"
          className="max-w-xl px-2"
          value={value.unit}
          onChange={handleChange}
        />

        <Button onClick={handleSubmit}> Submit </Button>
      </div>
       
    </>
  )
}