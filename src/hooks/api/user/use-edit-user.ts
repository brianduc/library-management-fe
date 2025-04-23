import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useEditUser = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const editUser = async ({ id, data }: { id: string; data: any }) => {
    try {
      setLoading(true)
      const response = await axios.put(`users/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { editUser, loading }
}
