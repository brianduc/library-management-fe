import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

export interface Book {
  _id: string
  title: string
  author: string
  isbn: string
  publisher: string
  published_year: number
  quantity: number
  available_quantity: number
  category: string
  description: string
  cover_image: string
  is_active: boolean
}

const useGetBooksV2 = () => {
  const { data, error, isLoading } = useSWR<Book[]>(
    Endpoints.Books.GET_ALL_V2,
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default useGetBooksV2 