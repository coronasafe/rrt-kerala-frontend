import Link from "next/link";
import { useContext, useMemo } from "react";
import { Sun, Moon } from "react-feather";
import { ThemeContext } from "use-theme-switcher";

export default function Header() {
  const { theme, switchTheme } = useContext(ThemeContext);
  const isDark = useMemo(() => theme === "dark", [theme]);
  return (
    <header className="flex items-center justify-between sticky inset-x-0 top-0 mb-4">
      <Link href="/">
        <a className="text-xl font-bold hover:text-green-500 shine">
          RRT DIRECTORY
        </a>
      </Link>
      <button
        type="button"
        onClick={() => (isDark ? switchTheme("light") : switchTheme("dark"))}
        className="focus:outline-none outline-none hover:text-green-500 shine"
      >
        {isDark ? <Sun /> : <Moon />}
      </button>
    </header>
  );
}
