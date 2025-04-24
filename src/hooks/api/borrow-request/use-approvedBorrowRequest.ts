import { useAxios } from "@/hooks/api/use-axios";
export const useApproveBorrowRequest = () => {
  const axios = useAxios();

  const approveRequest = async (id: string) => {
    try {
      const res = await axios.patch(`borrow-requests/${id}/approve`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { approveRequest };
};
