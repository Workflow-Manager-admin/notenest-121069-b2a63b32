import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// PUBLIC_INTERFACE
function Layout({ children }) {
  /**
   * Layout component for the app.
   * Renders Sidebar, Header, and a responsive main content area.
   * Sidebar collapses on mobile, Header remains sticky at top.
   */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar for mobile
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`app-layout${sidebarOpen ? " sidebar-open" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-area">
        <Header
          onSidebarToggle={handleSidebarToggle}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
}

export default Layout;
