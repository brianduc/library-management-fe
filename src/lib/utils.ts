import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axiosService from "@/lib/services/axios.service";

const axios = axiosService.getAxiosInstance();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosFetcher = (url: string) => axios.get(url).then((res) => res.data);
