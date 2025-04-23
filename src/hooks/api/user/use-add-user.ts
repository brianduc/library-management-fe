import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useAddUser = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const addUser = async ({ data }: { data: any }) => {
    try {
      setLoading(true)
      const response = await axios.post(`users`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { addUser, loading }
}
