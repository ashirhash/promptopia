"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "/components/ui/popover";

const Nav = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const setupProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    setupProviders();
  }, []);

  return (
    <nav className="flex justify-between items-center w-full p-3">
      <Link href="/" className="flex gap-2 items-center">
        <Image
          priority={true}
          width={50}
          height={50}
          alt="Pormptopia Logo"
          className="object-contain"
          src="/assets/images/logo.svg"
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      <div className="flex relative">
        {session?.user ? (
          <div className="flex gap-5 items-center">
            <Link href="/create-prompt" className="black_btn hidden sm:block">
              Create Prompt
            </Link>
            <Popover>
              <PopoverTrigger>
                <div className="flex">
                  <Image
                    src={session?.user.image || ""}
                    width={37}
                    height={37}
                    alt="profile"
                    className="rounded-lg"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="dropdown w-auto min-w-52">
                <Link href="/profile" className="dropdown_link">
                  My Profile
                </Link>
                <Link href="/create-prompt" className="dropdown_link sm:hidden">
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                  }}
                  className="mt-3 black_btn"
                >
                  Sign Out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider: any) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
