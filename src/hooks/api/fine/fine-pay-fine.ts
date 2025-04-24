import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Endpoints } from "@/lib/endpoints"

export const usePayFine = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const payFine = async (id: string) => {
    try {
      setLoading(true)
      const response = await axios.patch(Endpoints.Fine.PATCH(id))
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { payFine, loading }
} 