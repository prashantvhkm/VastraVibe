import React, { useState, useEffect } from "react";

// Profile Image Upload Component
const ProfileImageUpload = ({ currentImage, onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center mb-4">
      <div className="position-relative d-inline-block">
        <img
          src={previewUrl || "/api/placeholder/120/120"}
          alt="Profile"
          className="rounded-circle border border-3 border-danger"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <label
          htmlFor="profileImage"
          className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle p-2 cursor-pointer"
          style={{ width: "36px", height: "36px" }}
        >
          <i className="fas fa-camera"></i>
          <input
            type="file"
            id="profileImage"
            className="d-none"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
};

// Edit Profile Form Component
const EditProfileForm = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <ProfileImageUpload
                currentImage={formData.profileImage}
                onImageChange={(image) =>
                  setFormData((prev) => ({ ...prev, profileImage: image }))
                }
              />

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.fullName ? "is-invalid" : ""
                    }`}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Bio</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    maxLength="200"
                  />
                  <div className="form-text">
                    {formData.bio.length}/200 characters
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="Support">Support</option>
                    <option value="Technical">Technical</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Your location"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Change Password Form Component
const ChangePasswordForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Current Password *
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      className={`form-control ${
                        errors.currentPassword ? "is-invalid" : ""
                      }`}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={toggleShowPasswords}
                    >
                      <i
                        className={`fas fa-eye${showPasswords ? "-slash" : ""}`}
                      ></i>
                    </button>
                    {errors.currentPassword && (
                      <div className="invalid-feedback">
                        {errors.currentPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    New Password *
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      className={`form-control ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="form-text">
                    Password must be at least 8 characters long
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Confirm New Password *
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ activities }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      login: "fa-sign-in-alt text-success",
      logout: "fa-sign-out-alt text-warning",
      update: "fa-edit text-primary",
      create: "fa-plus-circle text-info",
      delete: "fa-trash text-danger",
    };
    return icons[type] || "fa-circle text-muted";
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0">
        <h6 className="mb-0">Recent Activity</h6>
      </div>
      <div className="card-body">
        <div className="timeline">
          {activities.map((activity, index) => (
            <div key={index} className="timeline-item d-flex mb-3">
              <div className="timeline-icon me-3">
                <i className={`fas ${getActivityIcon(activity.type)}`}></i>
              </div>
              <div className="timeline-content flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <p className="mb-1 small">{activity.description}</p>
                  <small className="text-muted">
                    {formatDate(activity.timestamp)}
                  </small>
                </div>
                <small className="text-muted">{activity.ipAddress}</small>
              </div>
            </div>
          ))}
        </div>
        {activities.length === 0 && (
          <div className="text-center py-4">
            <i className="fas fa-history fa-2x text-muted mb-2"></i>
            <p className="text-muted mb-0">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "Prashant Vishwakarma",
    email: "prashant@vastravibe.com",
    phone: "+91 98765 43210",
    role: "Administrator",
    department: "Management",
    location: "Mumbai, India",
    bio: "Experienced e-commerce administrator with 5+ years in fashion retail management.",
    profileImage: "",
    joinDate: "2024-01-15",
    lastLogin: "2025-10-28T14:30:00",
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);

  // Mock activity data
  const activities = [
    {
      type: "login",
      description: "Logged in to admin panel",
      timestamp: "2025-10-28T14:30:00",
      ipAddress: "192.168.1.100",
    },
    {
      type: "update",
      description: "Updated product inventory",
      timestamp: "2025-10-28T13:15:00",
      ipAddress: "192.168.1.100",
    },
    {
      type: "create",
      description: "Added new product category",
      timestamp: "2025-10-28T11:45:00",
      ipAddress: "192.168.1.100",
    },
    {
      type: "update",
      description: "Processed customer orders",
      timestamp: "2025-10-28T10:20:00",
      ipAddress: "192.168.1.100",
    },
    {
      type: "logout",
      description: "Logged out from admin panel",
      timestamp: "2025-10-27T18:30:00",
      ipAddress: "192.168.1.100",
    },
  ];

  // Load profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("vastravibe-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem("vastravibe-profile", JSON.stringify(profile));
  }, [profile]);

  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  const handleChangePassword = () => {
    setShowPasswordForm(true);
  };

  const handleSavePassword = (passwordData) => {
    // In real app, this would make an API call to change password
    console.log("Password change requested:", passwordData);
    setShowPasswordForm(false);
    alert("Password changed successfully!");
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">Admin Profile</h3>
          <p className="text-muted mb-0">
            Manage your profile and account settings
          </p>
        </div>
        <div>
          <button
            className="btn btn-outline-danger me-2"
            onClick={handleChangePassword}
          >
            <i className="fas fa-key me-2"></i>
            Change Password
          </button>
          <button className="btn btn-danger" onClick={handleEditProfile}>
            <i className="fas fa-edit me-2"></i>
            Edit Profile
          </button>
        </div>
      </div>

      {saved && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="fas fa-check-circle me-2"></i>
          Profile updated successfully!
          <button
            type="button"
            className="btn-close"
            onClick={() => setSaved(false)}
          ></button>
        </div>
      )}

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <nav className="nav flex-column">
                <button
                  className={`nav-link text-start py-3 border-bottom ${
                    activeTab === "overview"
                      ? "active text-danger bg-light"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <i className="fas fa-user me-2"></i>
                  Overview
                </button>
                <button
                  className={`nav-link text-start py-3 border-bottom ${
                    activeTab === "activity"
                      ? "active text-danger bg-light"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab("activity")}
                >
                  <i className="fas fa-history me-2"></i>
                  Activity Log
                </button>
                <button
                  className={`nav-link text-start py-3 border-bottom ${
                    activeTab === "security"
                      ? "active text-danger bg-light"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <i className="fas fa-shield-alt me-2"></i>
                  Security
                </button>
                <button
                  className={`nav-link text-start py-3 ${
                    activeTab === "preferences"
                      ? "active text-danger bg-light"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab("preferences")}
                >
                  <i className="fas fa-cog me-2"></i>
                  Preferences
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="col-lg-9">
          {activeTab === "overview" && (
            <div className="row">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="rounded-circle border border-3 border-danger mb-3"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle border border-3 border-danger bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: "120px", height: "120px" }}
                      >
                        <span className="text-danger fw-bold fs-2">
                          {getInitials(profile.fullName)}
                        </span>
                      </div>
                    )}

                    <h5 className="fw-bold text-danger mb-1">
                      {profile.fullName}
                    </h5>
                    <p className="text-muted mb-3">{profile.role}</p>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleEditProfile}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Edit Profile
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleChangePassword}
                      >
                        <i className="fas fa-key me-2"></i>
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0">Profile Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Full Name
                        </label>
                        <p className="fw-semibold">{profile.fullName}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Email Address
                        </label>
                        <p className="fw-semibold">{profile.email}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Phone Number
                        </label>
                        <p className="fw-semibold">{profile.phone}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Role
                        </label>
                        <p className="fw-semibold">{profile.role}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Department
                        </label>
                        <p className="fw-semibold">{profile.department}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Location
                        </label>
                        <p className="fw-semibold">{profile.location}</p>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold text-muted">
                          Bio
                        </label>
                        <p className="fw-semibold">{profile.bio}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Member Since
                        </label>
                        <p className="fw-semibold">
                          {formatDate(profile.joinDate)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-muted">
                          Last Login
                        </label>
                        <p className="fw-semibold">
                          {new Date(profile.lastLogin).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="row">
              <div className="col-12">
                <ActivityLog activities={activities} />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0">Security Settings</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                              <i className="fas fa-key text-danger me-2"></i>
                              Password Security
                            </h6>
                            <p className="text-muted small mb-3">
                              Last changed: 2 weeks ago
                            </p>
                            <button
                              className="btn btn-outline-danger w-100"
                              onClick={handleChangePassword}
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                              <i className="fas fa-shield-alt text-danger me-2"></i>
                              Two-Factor Authentication
                            </h6>
                            <p className="text-muted small mb-3">
                              Add an extra layer of security
                            </p>
                            <button className="btn btn-outline-danger w-100">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                              <i className="fas fa-desktop text-danger me-2"></i>
                              Active Sessions
                            </h6>
                            <p className="text-muted small mb-3">
                              1 active session
                            </p>
                            <button className="btn btn-outline-danger w-100">
                              Manage Sessions
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                              <i className="fas fa-bell text-danger me-2"></i>
                              Login Alerts
                            </h6>
                            <p className="text-muted small mb-3">
                              Get notified for new logins
                            </p>
                            <button className="btn btn-outline-danger w-100">
                              Configure Alerts
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0">Account Preferences</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Language
                        </label>
                        <select className="form-select">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Timezone
                        </label>
                        <select className="form-select">
                          <option value="Asia/Kolkata">
                            India Standard Time (IST)
                          </option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Date Format
                        </label>
                        <select className="form-select">
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="emailNotifications"
                          />
                          <label
                            className="form-check-label fw-semibold"
                            htmlFor="emailNotifications"
                          >
                            Email Notifications
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="pushNotifications"
                          />
                          <label
                            className="form-check-label fw-semibold"
                            htmlFor="pushNotifications"
                          >
                            Push Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <EditProfileForm
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordForm && (
        <ChangePasswordForm
          onSave={handleSavePassword}
          onCancel={handleCancelPassword}
        />
      )}
    </div>
  );
};

export default Profile;
