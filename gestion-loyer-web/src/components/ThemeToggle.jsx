import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label="Changer le thème"
    >
      <span className="toggle-icon">
        {theme === "light" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

export default ThemeToggle;