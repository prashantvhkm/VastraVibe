import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminSidebar = ({ onToggle, onMobileToggle, mobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    onToggle?.(newCollapsedState);
  };

  const handleMobileClose = () => {
    if (window.innerWidth < 768) {
      onMobileToggle?.();
    }
  };

  const menuItems = [
    { to: "/admin/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/admin/products", icon: "bi-bag-check", label: "Products" },
    { to: "/admin/product-categories", icon: "bi-tags", label: "Categories" },
    { to: "/admin/orders", icon: "bi-box-seam", label: "Orders" },
    { to: "/admin/payments", icon: "bi-credit-card", label: "Payments" },
    { to: "/admin/reports", icon: "bi-bar-chart-line", label: "Reports" },
    { to: "/admin/settings", icon: "bi-gear", label: "Settings" },
    { to: "/admin/profile", icon: "bi-person-circle", label: "Profile" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: "999",
          }}
          onClick={handleMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`d-flex flex-column vh-100 position-fixed top-0 start-0 text-white shadow-lg transition-all ${
          collapsed ? "collapsed" : ""
        } ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          width: collapsed ? "80px" : "260px",
          background: "linear-gradient(180deg, #dc3545 0%, #c82333 100%)",
          zIndex: "1000",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Header with Toggle */}
        <div className="d-flex align-items-center justify-content-between py-3 px-3 border-bottom border-light border-opacity-25">
          {!collapsed && (
            <div className="text-center flex-grow-1">
              <h4 className="fw-bold mb-0">🛍️ VastraVibe</h4>
              <small className="text-light opacity-75">Admin Panel</small>
            </div>
          )}
          {collapsed && (
            <div className="text-center w-100">
              <h5 className="fw-bold mb-0">🛍️</h5>
            </div>
          )}
          <button
            className="btn btn-link text-light p-0 ms-2"
            onClick={toggleSidebar}
            style={{ minWidth: "30px" }}
          >
            <i className={`bi bi-chevron-${collapsed ? "right" : "left"}`}></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow-1 mt-3 px-2">
          <ul className="nav flex-column">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                isActive={location.pathname === item.to}
                onClick={handleMobileClose}
              />
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="mt-auto p-3 border-top border-light border-opacity-25">
          {!collapsed && (
            <div className="d-flex align-items-center mb-3 px-2">
              <div className="flex-shrink-0">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <span className="text-danger fw-bold">PV</span>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="mb-0 fw-semibold small">Prashant Vishwakarma</p>
                <small className="text-light opacity-75">Admin</small>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="text-center mb-3">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "40px", height: "40px" }}
              >
                <span className="text-danger fw-bold">PV</span>
              </div>
            </div>
          )}

          {/* Simple Status Indicator */}
          <div className="text-center">
            <small className="text-light opacity-75">
              <i className="bi bi-circle-fill text-success me-1"></i>
              {!collapsed && "Online"}
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

// Sidebar Item Component
const SidebarItem = ({ to, icon, label, collapsed, isActive, onClick }) => (
  <li className="nav-item mb-2">
    <NavLink
      to={to}
      className={({ isActive: linkActive }) =>
        `nav-link text-white d-flex align-items-center gap-3 px-3 py-2 rounded-3 fw-semibold transition-all ${
          linkActive || isActive
            ? "bg-dark text-danger shadow-sm"
            : "text-light hover-bg"
        } ${collapsed ? "justify-content-center" : ""}`
      }
      title={collapsed ? label : ""}
      onClick={onClick}
    >
      <i className={`bi ${icon} ${collapsed ? "fs-5" : "fs-6"}`}></i>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  </li>
);

export default AdminSidebar;
