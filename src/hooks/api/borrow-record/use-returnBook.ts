import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";

export const useReturnBook = () => {
  const axios = useAxios();

  const returnBook = async (id: string) => {
    try {
      const res = await axios.patch(`${Endpoints.BorrowRecord.API}${id}/return`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { returnBook };
};
