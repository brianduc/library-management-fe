import { Category } from "@/hooks/api/category/use-get-categories"
import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

const useGetCategoryById = (id: string) => {
  const { data, error, isLoading } = useSWR<Category>(
    id ? Endpoints.Categories.GET_BY_ID(id) : null,
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default useGetCategoryById