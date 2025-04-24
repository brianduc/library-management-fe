import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

export interface User {
  createdAt: Date
  email: string
  full_name: string
  identity_number: string
  _id: string
  is_active: boolean
  phone: string
  updatedAt: Date
  role: "staff" | "admin" | "member"
  is_verified?: boolean
}

const useGetUsers = () => {
  const { data, error, isLoading } = useSWR<User[]>(
    Endpoints.Users.GET_ALL,
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default useGetUsers
