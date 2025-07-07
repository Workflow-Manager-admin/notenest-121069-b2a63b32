import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import SearchBar from "./components/SearchBar";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // The theme toggle button is passed down as a React node to the Header via children (or use context/provider if needed)
  return (
    <div className="App">
      <Layout>
        <div className="notes-main-wrapper">
          <div className="notes-header-tools">
            <SearchBar />
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
          <div className="notes-content-area">
            <NotesList />
            <NoteEditor />
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default App;
