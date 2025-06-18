import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addQuery(
  searchParams: string,
  query?: { name: string; value: string }[]
) {
  const params = new URLSearchParams(searchParams);
  query?.forEach(({ name, value }) => {
    params.set(name, value);
  });

  return params.toString();
}

export function timeFormatTo12(time: string) {
  const newTime = time
    .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/)
    ?.slice(1, 4);
  if (newTime) {
    newTime[0] = (+newTime[0] % 12 || 12) + "";
    newTime[5] = +newTime[0] < 12 ? " AM" : " PM";
    return newTime?.join("");
  } else throw new Error("");
}

export function formateDate(date: string) {
  const temp = date.split("/");
  return `${temp[2]}-${Number(temp[0]) > 9 ? temp[0] : `0${temp[0]}`}-${
    Number(temp[1]) > 9 ? temp[1] : `0${temp[1]}`
  }`;
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const getEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as Entries<T>;
