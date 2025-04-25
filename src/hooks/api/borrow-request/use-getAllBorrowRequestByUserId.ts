import { useAxios } from "@/hooks/api/use-axios";
import { userInfoAtom } from "@/stores/auth";
import { useAtomValue } from "jotai/react";
import { useState } from "react";

export const useGetAllBorrowRequestByUserId = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState<any[]>([]); 
 const user = useAtomValue(userInfoAtom);
  const fetchBorrowRequestByUserId = async () => {

    try {
      setLoading(true);
      const response = await axios.get(`borrow-requests/${user?._id}`); 
      console.log("API response:", response);
      setBorrowRequests(response.data.data); 
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBorrowRequestByUserId, borrowRequests, loading };
};
