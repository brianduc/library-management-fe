import { useAxios } from "@/hooks/api/use-axios";
import { useState } from "react";

export const useGetAllBorrowRequestByUserId = (userId:string) => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState<any[]>([]); 

  const fetchBorrowRequestByUserId = async () => {

    try {
      setLoading(true);
      const response = await axios.get(`borrow-requests/${userId}`); 
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
