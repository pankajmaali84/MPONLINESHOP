import { createContext, useState, useEffect } from "react";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : true;
  });

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    // Apply/remove the 'dark' class on the html element for Tailwind dark mode
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};