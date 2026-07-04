"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function SettingsAppearance() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-2">
          <Sun className="h-5 w-5 text-blue-700" />
        </div>

        <h2 className="text-lg font-bold text-gray-900">
          Appearance
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Light */}
        <button
          type="button"
          onClick={() => handleThemeChange("light")}
          className={`rounded-lg border-2 p-4 transition active:scale-95 cursor-pointer ${
            theme === "light"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-500 hover:border-blue-600"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Sun className="h-6 w-6" />
            <span className="font-semibold text-xs uppercase tracking-wider">
              Light Mode
            </span>
          </div>
        </button>

        {/* Dark */}
        <button
          type="button"
          onClick={() => handleThemeChange("dark")}
          className={`rounded-lg border-2 p-4 transition active:scale-95 cursor-pointer ${
            theme === "dark"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-500 hover:border-blue-600"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Moon className="h-6 w-6" />
            <span className="font-semibold text-xs uppercase tracking-wider">
              Dark Mode
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}