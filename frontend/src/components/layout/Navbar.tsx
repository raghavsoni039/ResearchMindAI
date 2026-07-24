"use client";

import { Search, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {

  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (

    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">

      <div className="h-20 px-8 flex items-center justify-between">

        {/* Left */}

        <div>

          <h1 className="text-2xl font-bold">

            🧠 ResearchMind AI

          </h1>

        </div>

        {/* Center */}

        <div className="hidden lg:flex w-[420px]">

          <div className="relative w-full">

            <Search
              className="absolute left-4 top-3.5 text-muted-foreground"
              size={18}
            />

            <input
              placeholder="Search papers..."
              className="w-full rounded-full border bg-card pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <button
            id="btn-toggle-theme"
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="rounded-full border p-3 hover:bg-muted"
          >

            {theme === "dark"
              ? <Sun size={18} />
              : <Moon size={18} />}

          </button>

          <button className="rounded-full border p-3 hover:bg-muted">

            <Bell size={18} />

          </button>

          {/* User avatar + info + sign out */}

          <div className="flex items-center gap-3">

            {/* Avatar */}
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm select-none">
                {initials}
              </div>
            )}

            {/* Name + email */}
            <div className="hidden md:block">

              <p className="font-semibold leading-tight">
                {user?.name ?? "Researcher"}
              </p>

              <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                {user?.email ?? ""}
              </p>

            </div>

            {/* Sign out */}
            <button
              id="btn-sign-out"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              title="Sign out"
              className="rounded-full border p-2.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut size={16} />
            </button>

          </div>

        </div>

      </div>

    </header>

  );

}