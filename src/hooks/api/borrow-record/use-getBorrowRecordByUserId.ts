import { useAxios } from "@/hooks/api/use-axios";
import { useState } from "react";

export const useGetBorrowRecordByUserId = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]); 

  const fetchBorrowRecordByUserId = async () => {
    const userId = "6809c0cac5016ef253428407"
    try {
      setLoading(true);
      const response = await axios.get(`borrow-records/user/${userId}`); 
      setBorrowRecords(response.data.data); 
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBorrowRecordByUserId, borrowRecords, loading };
};
