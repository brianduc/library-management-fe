import AuthWrapper from "@/components/common/layout/auth-wrapper";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthWrapper>
      <Component {...pageProps} />;
    </AuthWrapper>
  );
}
