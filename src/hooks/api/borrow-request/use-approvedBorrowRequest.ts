import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";

export const useApproveBorrowRequest = () => {
  const axios = useAxios();

  const approveRequest = async (id: string) => {
    try {
      const res = await axios.patch(`${Endpoints.BorrowRequest.API}${id}/approve`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { approveRequest };
};
