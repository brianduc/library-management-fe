import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Book } from "@/hooks/api/book/use-get-books"


export const useAddBook = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const addBook = async ({ data }: { data: any }) => {
    try {
      setLoading(true)
      const response = await axios.post<Book>(`books`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { addBook, loading }
}