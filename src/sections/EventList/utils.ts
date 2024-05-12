import moment from "moment-timezone";

export const SELECT_UNIT ={
  1: 'Umum',
  2: 'PPA I',
  3: 'PPA II',
  4: 'PAPK',
  5: 'SKKI'
}

export function parseTimeZone(date: string) {
  return moment(date).tz('Asia/jakarta').format("YYYY-MM-DD");
}