import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Book } from "@/hooks/api/book/use-get-books"


export const useEditBook = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const editBook = async ({ id, data }: { id: string; data: any }) => {
    try {
      setLoading(true)
      const response = await axios.put<Book>(`books/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { editBook, loading }
}
