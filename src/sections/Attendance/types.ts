import {z} from "zod";


export interface AddAttendanceBody{
  id: string,
  name: string,
  email: string,
  identifier: string,
  unit: string
};

export interface TodayEventsType{
  id: string;
  title: string;
  uic: number;
  date: string;
  status: number;
}

export interface AddAttendanceError{
  id: boolean,
  name: boolean,
  email: boolean,
  identifier: boolean,
  unit: boolean
};

export interface AttendanceFormTypes{
  todayEvents: TodayEventsType[] | [],
  addAttendance: (body: AddAttendanceBody) => Promise<void>
};

export interface AttendanceEventBody{
  id: string,
  name: string,
  email: string,
  identifier: string,
  submitted_at: string,
  unit: string,
  title: string,
  date: string,
  updated_at: string
};


export const idSchema =  z.string().uuid();

export const nameSchema = z.string().min(1, 'Invalid Name');

export const emailSchema = z.string().email('Invalid Email');

export const unitSchema = z.string().nullable();

export const identifierSchema = z.string().nullable();
