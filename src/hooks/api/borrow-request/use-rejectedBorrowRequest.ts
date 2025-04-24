import { useAxios } from "@/hooks/api/use-axios";

export const useRejectBorrowRequest = () => {
  const axios = useAxios();

  const rejectRequest = async (id: string) => {
    try {
      const res = await axios.patch(`borrow-requests/${id}/rejected`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { rejectRequest };
};
