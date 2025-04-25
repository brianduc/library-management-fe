import { User } from "@/hooks/api/user/use-get-users";
import { Endpoints } from "@/lib/endpoints";
import { axiosFetcher } from "@/lib/utils";
import useSWR from "swr";

export const useAuth = () => {
  const { data: user, error, isLoading } = useSWR<User>(
    Endpoints.Auth.REFRESH,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    user,
    error,
    isLoading,
    isAuthenticated: !!user,
  };
}; 