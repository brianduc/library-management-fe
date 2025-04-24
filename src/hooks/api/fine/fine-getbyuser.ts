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

interface BorrowRecord {
  _id: string
  user_id: string
  book_id: Book
  due_date: string
  is_returned: boolean
  borrow_date: string
  return_date: string
  is_review: boolean
  __v: number
}

export interface Fine {
  _id: string
  user_id: User
  borrow_record_id: BorrowRecord
  book_id: Book
  amount: number
  reason: string
  is_paid: boolean
  issued_date: string
  __v: number
}

const fineGetFineByUser = () => {
  const { data, error, isLoading } = useSWR<Fine[]>(
    Endpoints.Fine.GET_BY_USER,
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default fineGetFineByUser