import { Book } from "@/hooks/api/book/use-get-books"
import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

const useGetBookById = (id: string) => {
    const { data, error, isLoading } = useSWR<Book>(
        id ? Endpoints.Books.GET_BY_ID(id) : null,
        axiosFetcher,
    )
    return { data, error, isLoading }
}

export default useGetBookById