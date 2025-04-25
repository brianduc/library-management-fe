import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Endpoints } from "@/lib/endpoints"
import { useSWRConfig } from "swr"

interface ReviewData {
  book_id: string;
  rating: number;
  comment: string;
}

const useAddReview = () => {
  const axios = useAxios()
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)

  const addReview = async (data: ReviewData) => {
    try {
      setLoading(true)
      const response = await axios.post(Endpoints.Review.CREATE, data)
      await mutate(Endpoints.Review.GET_ALL(data.book_id))
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { addReview, loading }
}

export default useAddReview
