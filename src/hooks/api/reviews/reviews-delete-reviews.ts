import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Endpoints } from "@/lib/endpoints"
import { useSWRConfig } from "swr"

export const useDeleteReview = () => {
  const axios = useAxios()
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)

  const deleteReview = async (reviewId: string) => {
    try {
      setLoading(true)
      console.log('reviewId', reviewId);
      const { data } = await axios.delete(Endpoints.Review.DELETE(reviewId))
      await mutate(Endpoints.Review.GET_ALL)
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deleteReview, loading }
}
