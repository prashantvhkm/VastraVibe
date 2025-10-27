import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductCategories from "./pages/ProductCategories";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import PageNotFound from "./Components/PageNotFound ";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Handle sidebar collapse state from child component
  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [window.location.pathname]);

  // Auto-close sidebar on mobile when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 80 : 260;
  const mainContentMargin = window.innerWidth < 768 ? 0 : sidebarWidth;

  return (
    <BrowserRouter>
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className={`${mobileSidebarOpen ? "d-block" : "d-none d-lg-block"}`}
        >
          <AdminSidebar
            onToggle={handleSidebarToggle}
            onMobileToggle={handleMobileSidebarToggle}
            mobileOpen={mobileSidebarOpen}
          />
        </div>

        {/* Main Content Area */}
        <div
          className="flex-grow-1 bg-light"
          style={{
            marginLeft: mainContentMargin,
            padding: "25px",
            minHeight: "100vh",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {/* Mobile Header */}
          <div className="d-lg-none mb-4">
            <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded shadow-sm">
              <button
                className="btn btn-outline-danger"
                onClick={handleMobileSidebarToggle}
              >
                <i className="bi bi-list"></i>
              </button>
              <h5 className="mb-0 text-danger fw-bold">VastraVibe Admin</h5>
              <div style={{ width: "40px" }}></div> {/* Spacer for alignment */}
            </div>
          </div>

          <Routes>
            {/* Direct Routes - No Authentication Required */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route
              path="/admin/product-categories"
              element={<ProductCategories />}
            />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/profile" element={<Profile />} />

            {/* Default Redirect */}
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* 404 Page */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
