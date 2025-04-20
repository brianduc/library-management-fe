import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      // exp is in seconds
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthWrapper;
