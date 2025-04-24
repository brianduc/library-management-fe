import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"
import { Endpoints } from "@/lib/endpoints"
import { useSWRConfig } from "swr"

interface UpdateReviewPayload {
  rating: number;
  comment: string;
}

export const useUpdateReview = (reviewId: string) => {
  const axios = useAxios();
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const updateReview = async (payload: UpdateReviewPayload) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        Endpoints.Review.UPDATE(reviewId),
        payload
      );
      await mutate(Endpoints.Review.GET_ALL);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateReview, loading };
};
