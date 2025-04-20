import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { Constants } from "@/lib/constants";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem(Constants.API_TOKEN_KEY);
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      // exp is in seconds
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem(Constants.API_TOKEN_KEY);
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      localStorage.removeItem(Constants.API_TOKEN_KEY);
      router.replace("/login");
    }
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
