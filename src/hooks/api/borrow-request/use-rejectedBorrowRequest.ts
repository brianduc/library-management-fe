import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";

export const useRejectBorrowRequest = () => {
  const axios = useAxios();

  const rejectRequest = async (id: string) => {
    try {
      const res = await axios.patch(`${Endpoints.BorrowRequest.API}${id}/rejected`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { rejectRequest };
};
