"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { EdgeStoreProvider } from "@utils/contexts";

interface ProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const Provider = ({ children, session }: ProviderProps) => {
  return (
    <SessionProvider session={session}>
      <EdgeStoreProvider >{children}</EdgeStoreProvider>
    </SessionProvider>
  );
};

export default Provider;
