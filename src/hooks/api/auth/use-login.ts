import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";
import { useState } from "react";

export const useLogin = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(Endpoints.Auth.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
