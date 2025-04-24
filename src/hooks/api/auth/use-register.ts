import { useAxios } from "@/hooks/api/use-axios"
import { Endpoints } from "@/lib/endpoints"
import { useState } from "react"

export const useRegister = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const register = async (
    full_name: string,
    phone: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true)
      const response = await axios.post(Endpoints.Auth.REGISTER, {
        email,
        password,
        full_name,
        phone,
      })
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
