import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="mb-4">
          <i
            className="bi bi-exclamation-triangle text-warning"
            style={{ fontSize: "4rem" }}
          ></i>
        </div>
        <h1 className="fw-bold text-danger mb-3">404</h1>
        <h4 className="mb-3">Page Not Found</h4>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/admin/dashboard" className="btn btn-danger">
          <i className="bi bi-house me-2"></i>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
