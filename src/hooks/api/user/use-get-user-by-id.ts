import { User } from "@/hooks/api/user/use-get-users"
import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

const useGetUserById = (id: string) => {
  const { data, error, isLoading } = useSWR<User>(
    Endpoints.Users.GET_BY_ID(id),
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default useGetUserById
