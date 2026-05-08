import React, { useMemo, useRef, useEffect } from "react";
import { Search, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../services/userService";

interface HeaderProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSemanticSearch: boolean;
  onSemanticToggle: (active: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  isSemanticSearch,
  onSemanticToggle,
}) => {
  const { logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    const handleFocusSearch = () => {
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focus-search", handleFocusSearch);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus-search", handleFocusSearch);
    };
  }, []);

  const initials = useMemo(() => {
    if (!user) return "";
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email.slice(0, 2).toUpperCase();
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.name || user.email.split("@")[0];
  }, [user]);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="flex max-w-2xl flex-1 items-center gap-3">
          <div className="group relative flex-1">
            <Search
              className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                isSemanticSearch
                  ? "text-indigo-500"
                  : "text-gray-400 group-focus-within:text-indigo-400"
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isSemanticSearch
                  ? "Search by intent (e.g. 'how to connect to db')..."
                  : "Search snippets by keywords..."
              }
              aria-label="Search snippets"
              className={`w-full rounded-xl border bg-gray-50 py-2 pr-16 pl-10 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/10 ${
                isSemanticSearch
                  ? "border-indigo-200 bg-indigo-50/30"
                  : "border-transparent focus:border-gray-200 focus:bg-white"
              }`}
            />
            <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 font-sans text-[10px] font-medium text-gray-400 shadow-xs">
              <span className="text-xs">
                {navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl"}
              </span>
              <span>K</span>
            </div>
          </div>

          <button
            onClick={() => onSemanticToggle(!isSemanticSearch)}
            aria-pressed={isSemanticSearch}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-200 ${
              isSemanticSearch
                ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
            title={
              isSemanticSearch
                ? "Disable Semantic Search"
                : "Enable Semantic Search (AI-powered)"
            }
          >
            <Sparkles
              className={`h-3.5 w-3.5 ${isSemanticSearch ? "animate-pulse" : ""}`}
            />
            <span className="hidden sm:inline">
              {isSemanticSearch ? "AI Search" : "Keyword"}
            </span>
          </button>
        </div>

        {/* User Actions Section */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="group flex cursor-default items-center gap-2 sm:gap-3">
                <span className="hidden text-sm font-semibold text-gray-700 transition-colors group-hover:text-indigo-600 md:block">
                  {displayName}
                </span>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-xs font-extrabold text-indigo-600 transition-all duration-200 group-hover:border-indigo-300 group-hover:bg-indigo-100/50"
                  title={user.name || user.email}
                >
                  {initials}
                </div>
              </div>

              <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

              <button
                onClick={logout}
                className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                title="Sign Out"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="h-9 w-9 animate-pulse rounded-full border border-gray-200 bg-gray-50" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
