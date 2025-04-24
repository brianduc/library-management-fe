import { useAxios } from "@/hooks/api/use-axios";
import useSWR from "swr";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category_id: string;
  quantity_total: number;
  quantity_available: number;
  status: "available" | "borrowed" | "damaged" | "lost" | "out_of_stock";
  qr_code?: string;
  description?: string;
  is_hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BooksResponse {
  success: boolean;
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    books: Book[];
  };
  meta: Record<string, any>;
}

const useGetBooks = () => {
  const axios = useAxios();

  const fetcher = async (url: string) => {
    const response = await axios.get<BooksResponse>(url);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch books");
    }
    return response.data.data.books; 
  };

  const { data, error, isLoading } = useSWR("books", fetcher);

  return {
    data, // Book[]
    error,
    isLoading,
  };
};

export default useGetBooks;