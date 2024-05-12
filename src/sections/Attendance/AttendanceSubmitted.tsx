import {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DateValue,  
        Button, Input, DatePicker, Textarea, Select, SelectItem} from "@nextui-org/react";
import {parseDate} from "@internationalized/date";
import axiosAuth from "../../config/axios";
import Iconify from "../../components/Iconify";

export default function AttendanceSubmitted() {  
  return (
    <>
      <div className="flex flex-col w-full items-center justify-center gap-4">
        <h1> Attendance Submitted</h1>
      </div>
       
    </>
  )
}