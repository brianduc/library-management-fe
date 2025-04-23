import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useLockUser = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const lockUser = async ({ id }: { id: string }) => {
    try {
      setLoading(true)
      const response = await axios.patch(`users/${id}/lock`)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { lockUser, loading }
}
