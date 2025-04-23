import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axiosService from "@/lib/services/axios.service"
import { Constants } from "@/lib/constants"
import { RESET } from "jotai/utils"
import { getDefaultStore } from "jotai/vanilla"
import { userInfoAtom } from "@/stores/auth"

const axios = axiosService.getAxiosInstance()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const axiosFetcher = (url: string) =>
  axios.get(url).then((res) => res.data?.data)

export const logout = () => {
  localStorage.removeItem(Constants.API_TOKEN_KEY)
  const store = getDefaultStore()
  store.set(userInfoAtom, RESET)
  window.location.href = "/login"
}
