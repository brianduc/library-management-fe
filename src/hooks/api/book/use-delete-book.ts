import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useDeleteBook = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const deleteBook = async ({ id }: { id: string }) => {
    try {
      setLoading(true)
      const response = await axios.delete(`books/${id}`)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deleteBook, loading }
}