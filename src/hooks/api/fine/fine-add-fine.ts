import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

 const useAddFine = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const addFine = async ({ data }: { data: any }) => {
    try {
      setLoading(true)
      const response = await axios.post(`fines`, data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { addFine, loading }
} 

export default useAddFine