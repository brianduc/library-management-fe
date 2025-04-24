import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

export interface User {
  _id: string
  full_name: string
  email: string
  identity_number: string
  phone: string
  role: "admin" | "staff" | "member"
  is_active: boolean
}

const useGetUsersV2 = () => {
  const { data, error, isLoading } = useSWR<User[]>(
    Endpoints.Users.GET_ALLV2,
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default useGetUsersV2 