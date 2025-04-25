import { useAxios } from "@/hooks/api/use-axios";
import { useState } from "react";

export const useGetAllBorrowRequest = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState<any[]>([]); 

  const fetchBorrowRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("borrow-requests"); 
      console.log("API response:", response);
      setBorrowRequests(response.data.data); 
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBorrowRequests, borrowRequests, loading };
};
