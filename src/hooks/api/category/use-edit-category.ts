import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Category } from "@/hooks/api/category/use-get-categories"

export const useEditCategory = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const editCategory = async ({ id, data }: { id: string; data: any }) => {
    try {
      setLoading(true)
      const response = await axios.put<Category>(`categories/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { editCategory, loading }
}