import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

interface User {
  _id: string
  full_name: string
  email: string
}

interface Book {
  _id: string
  title: string
  author: string
}

export interface Review {
  _id: string
  user_id: string
  book_id: string
  rating: number
  comment: string
  created_at: string
  __v: number
}

const reviewsGetReviews = (id: string) => {
  const { data, error, isLoading } = useSWR<Review[]>(
    Endpoints.Review.GET_ALL(id),
    axiosFetcher,
  )
  console.log(data);
  return { data, error, isLoading }
}

export default reviewsGetReviews
