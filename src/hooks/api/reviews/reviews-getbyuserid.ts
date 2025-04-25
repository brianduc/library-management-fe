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

const reviewsGetByUserId = (book_id: string) => {
  const { data, error, isLoading } = useSWR<Review[]>(
    Endpoints.Review.GET_BY_USER_BY_BOOK_ID(book_id),
    axiosFetcher,
  )
  console.log('data', data);

  return { data, error, isLoading }
}

export default reviewsGetByUserId
