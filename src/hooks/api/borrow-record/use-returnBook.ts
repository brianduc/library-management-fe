import { useAxios } from "@/hooks/api/use-axios";

export const useReturnBook = () => {
  const axios = useAxios();

  const returnBook = async (id: string) => {
    try {
      const res = await axios.patch(`borrow-records/${id}/return`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return { returnBook };
};
