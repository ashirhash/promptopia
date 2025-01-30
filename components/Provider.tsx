"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { EdgeStoreProvider } from "utils/edgestore";
import { LoaderProvider } from "contexts/LoaderContext";

interface ProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const Provider = ({ children, session }: ProviderProps) => {
  return (
    <SessionProvider session={session}>
      <EdgeStoreProvider>
        <LoaderProvider>{children}</LoaderProvider>
      </EdgeStoreProvider>
    </SessionProvider>
  );
};

export default Provider;
