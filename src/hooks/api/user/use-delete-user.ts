import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useDeleteUser = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const deleteUser = async ({ id }: { id: string }) => {
    try {
      setLoading(true)
      const response = await axios.delete(`users/${id}`)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { deleteUser, loading }
}
