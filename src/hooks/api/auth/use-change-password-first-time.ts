import { useAxios } from "@/hooks/api/use-axios"
import { Endpoints } from "@/lib/endpoints"
import { useState } from "react"

export const useChangePasswordFirstTime = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const changePasswordFirstTime = async (
    userId: string,
    newPassword: string,
  ) => {
    try {
      setLoading(true)
      const response = await axios.post(
        Endpoints.Auth.CHANGE_PASSWORD_FIRST_TIME,
        {
          userId,
          newPassword,
        },
      )
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { changePasswordFirstTime, loading }
}
