import { nameSchema, emailSchema, identifierSchema, unitSchema, idSchema } from './types';
import {AddAttendanceBody} from './types';

export function validateForm(body: AddAttendanceBody) {
  const isValidId = idSchema.safeParse(body.id).success;
  const isValidName = nameSchema.safeParse(body.name).success;
  const isValidEmail = emailSchema.safeParse(body.email).success;
  const isValidIdentifier = identifierSchema.safeParse(body.identifier).success;
  const isValidUnit = unitSchema.safeParse(body.unit).success;

  if(isValidId && isValidName && isValidEmail && isValidIdentifier && isValidUnit){
    return true
  }

  return false
}