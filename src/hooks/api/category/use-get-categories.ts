import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

export interface Category {
  _id: string
  name: string
  __v: number
  createdAt: string
  updatedAt: string
}

const useGetCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    Endpoints.Categories.GET_ALL,
    axiosFetcher,
  )
  return { data, error, isLoading, mutate }
}

export default useGetCategories