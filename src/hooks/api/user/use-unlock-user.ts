import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useUnlockUser = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const unlockUser = async ({ id }: { id: string }) => {
    try {
      setLoading(true)
      const response = await axios.patch(`users/${id}/unlock`)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { unlockUser, loading }
}
