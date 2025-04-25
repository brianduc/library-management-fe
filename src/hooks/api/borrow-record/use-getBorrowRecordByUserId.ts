import { useAxios } from "@/hooks/api/use-axios";
import { userInfoAtom } from "@/stores/auth";
import { useAtomValue } from "jotai/react";
import { useState } from "react";

export const useGetBorrowRecordByUserId = () => {
    const user = useAtomValue(userInfoAtom);
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]); 

  const fetchBorrowRecordByUserId = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`borrow-records/user/${user?._id}`); 
      setBorrowRecords(response.data.data); 
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBorrowRecordByUserId, borrowRecords, loading };
};
