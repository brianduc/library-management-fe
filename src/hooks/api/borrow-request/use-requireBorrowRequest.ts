import { useAxios } from "@/hooks/api/use-axios";
export const useRequireBorrowRequest = () => {
  const axios = useAxios();

  const requireBorrow = async ({ user_id, book_id }: { user_id: string; book_id: string }) => {
    try {
      const res = await axios.post(`borrow-requests/`, {
        user_id,
        book_id,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { requireBorrow };
};
