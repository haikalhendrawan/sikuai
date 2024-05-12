import { DateValue } from "@nextui-org/react";

export interface EventTableType{
  key: string;
  id: string;
  title: string;
  uic: number;
  date: string;
  status: number;
  file: string
}

export interface EventType{
  id: string;
  title: string;
  uic: number;
  date: string;
  status: number;
  file: string
}

export interface ValueType{
  title: string,
  date: DateValue | null,
  uic: string
};

export interface EditValueType{
  id: string, 
  title: string,
  date: DateValue | null,
  uic: string
};

export interface AddEventType{
  title: string,
  date: string | null,
  uic: string
}

export interface EditEventType{
  id: string,
  title: string,
  date: string | null,
  uic: string
}
