import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useAddCategory = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const addCategory = async ({ data }: { data: any }) => {
    try {
      setLoading(true)
      const response = await axios.post(`categories`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { addCategory, loading }
}
