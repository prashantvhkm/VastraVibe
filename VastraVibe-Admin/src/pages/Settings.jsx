import React, { useState, useEffect } from "react";

// Settings Section Component
const SettingsSection = ({ title, description, children, icon }) => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white border-0">
        <div className="d-flex align-items-center">
          {icon && <i className={`fas fa-${icon} text-danger fs-5 me-3`}></i>}
          <div>
            <h5 className="mb-1 fw-bold text-danger">{title}</h5>
            {description && (
              <p className="text-muted mb-0 small">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ label, description, checked, onChange, name }) => {
  return (
    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
      <div>
        <label className="form-label fw-semibold mb-1">{label}</label>
        {description && <p className="text-muted small mb-0">{description}</p>}
      </div>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
          style={{ transform: "scale(1.2)" }}
        />
      </div>
    </div>
  );
};

// Main Settings Component
const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    websiteName: "VastraVibe",
    supportEmail: "support@vastravibe.com",
    adminEmail: "admin@vastravibe.com",
    phoneNumber: "+91 98765 43210",
    address: "123 Fashion Street, Mumbai, Maharashtra 400001",
    timezone: "Asia/Kolkata",
    currency: "INR",
    language: "en",

    // Store Settings
    storeMaintenance: false,
    allowRegistration: true,
    requireEmailVerification: true,
    enableWishlist: true,
    enableReviews: true,
    showOutOfStock: true,

    // Payment Settings
    enablePayments: true,
    paymentMethods: {
      upi: true,
      creditCard: true,
      debitCard: true,
      netBanking: true,
      wallet: true,
      cod: true,
    },
    testMode: false,
    razorpayKey: "",
    razorpaySecret: "",

    // Shipping Settings
    shippingEnabled: true,
    freeShippingThreshold: 999,
    shippingCost: 50,
    estimatedDelivery: "3-5 business days",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderConfirmation: true,
    shippingUpdates: true,
    promotionalEmails: false,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    loginAttempts: 5,

    // SEO Settings
    metaTitle: "VastraVibe - Fashion for Everyone",
    metaDescription: "Discover the latest fashion trends with VastraVibe",
    metaKeywords: "fashion, clothing, ethnic wear, western wear, accessories",
    googleAnalytics: "",
    facebookPixel: "",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("vastravibe-settings");
    if (savedSettings) {
      setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("vastravibe-settings", JSON.stringify(settings));
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle nested payment methods
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setSettings((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked,
          },
        }));
      } else {
        setSettings((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSaved(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default? This action cannot be undone."
      )
    ) {
      const defaultSettings = {
        websiteName: "VastraVibe",
        supportEmail: "support@vastravibe.com",
        adminEmail: "admin@vastravibe.com",
        phoneNumber: "+91 98765 43210",
        address: "123 Fashion Street, Mumbai, Maharashtra 400001",
        timezone: "Asia/Kolkata",
        currency: "INR",
        language: "en",
        storeMaintenance: false,
        allowRegistration: true,
        requireEmailVerification: true,
        enableWishlist: true,
        enableReviews: true,
        showOutOfStock: true,
        enablePayments: true,
        paymentMethods: {
          upi: true,
          creditCard: true,
          debitCard: true,
          netBanking: true,
          wallet: true,
          cod: true,
        },
        testMode: false,
        shippingEnabled: true,
        freeShippingThreshold: 999,
        shippingCost: 50,
        estimatedDelivery: "3-5 business days",
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderConfirmation: true,
        shippingUpdates: true,
        promotionalEmails: false,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: "strong",
        loginAttempts: 5,
        metaTitle: "VastraVibe - Fashion for Everyone",
        metaDescription: "Discover the latest fashion trends with VastraVibe",
        metaKeywords:
          "fashion, clothing, ethnic wear, western wear, accessories",
      };

      setSettings(defaultSettings);
    }
  };

  const tabs = [
    { id: "general", name: "General", icon: "cog" },
    { id: "store", name: "Store", icon: "store" },
    { id: "payment", name: "Payment", icon: "credit-card" },
    { id: "shipping", name: "Shipping", icon: "shipping-fast" },
    { id: "notifications", name: "Notifications", icon: "bell" },
    { id: "security", name: "Security", icon: "shield-alt" },
    { id: "seo", name: "SEO", icon: "search" },
  ];

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">Settings</h3>
          <p className="text-muted mb-0">
            Manage your store configuration and preferences
          </p>
        </div>
        <div>
          <button
            className="btn btn-outline-danger me-2"
            onClick={handleResetSettings}
          >
            <i className="fas fa-undo me-2"></i>
            Reset to Default
          </button>
          <button
            className="btn btn-danger"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {saved && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="fas fa-check-circle me-2"></i>
          Settings saved successfully!
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
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-link text-start py-3 border-bottom ${
                      activeTab === tab.id
                        ? "active text-danger bg-light"
                        : "text-muted"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={`fas fa-${tab.icon} me-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-lg-9">
          <form onSubmit={handleSaveSettings}>
            {/* General Settings */}
            {activeTab === "general" && (
              <>
                <SettingsSection
                  title="General Information"
                  description="Basic information about your store"
                  icon="cog"
                >
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Website Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="websiteName"
                        value={settings.websiteName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Support Email *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="supportEmail"
                        value={settings.supportEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Admin Email *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="adminEmail"
                        value={settings.adminEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={settings.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Store Address
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="address"
                        value={settings.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Timezone</label>
                      <select
                        className="form-select"
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleInputChange}
                      >
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="America/New_York">
                          Eastern Time (ET)
                        </option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Dubai">Dubai (GST)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Currency</label>
                      <select
                        className="form-select"
                        name="currency"
                        value={settings.currency}
                        onChange={handleInputChange}
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Language</label>
                      <select
                        className="form-select"
                        name="language"
                        value={settings.language}
                        onChange={handleInputChange}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                      </select>
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {/* Store Settings */}
            {activeTab === "store" && (
              <>
                <SettingsSection
                  title="Store Configuration"
                  description="Manage how your store operates"
                  icon="store"
                >
                  <ToggleSwitch
                    label="Store Maintenance Mode"
                    description="When enabled, your store will be temporarily unavailable to customers"
                    checked={settings.storeMaintenance}
                    onChange={handleInputChange}
                    name="storeMaintenance"
                  />

                  <ToggleSwitch
                    label="Allow Customer Registration"
                    description="Allow new customers to create accounts on your store"
                    checked={settings.allowRegistration}
                    onChange={handleInputChange}
                    name="allowRegistration"
                  />

                  <ToggleSwitch
                    label="Require Email Verification"
                    description="Send verification email when customers register"
                    checked={settings.requireEmailVerification}
                    onChange={handleInputChange}
                    name="requireEmailVerification"
                  />

                  <ToggleSwitch
                    label="Enable Wishlist"
                    description="Allow customers to save products to their wishlist"
                    checked={settings.enableWishlist}
                    onChange={handleInputChange}
                    name="enableWishlist"
                  />

                  <ToggleSwitch
                    label="Enable Product Reviews"
                    description="Allow customers to leave reviews on products"
                    checked={settings.enableReviews}
                    onChange={handleInputChange}
                    name="enableReviews"
                  />

                  <ToggleSwitch
                    label="Show Out of Stock Products"
                    description="Display products that are out of stock"
                    checked={settings.showOutOfStock}
                    onChange={handleInputChange}
                    name="showOutOfStock"
                  />
                </SettingsSection>
              </>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <>
                <SettingsSection
                  title="Payment Configuration"
                  description="Configure payment methods and gateway settings"
                  icon="credit-card"
                >
                  <ToggleSwitch
                    label="Enable Payments"
                    description="Accept payments from customers"
                    checked={settings.enablePayments}
                    onChange={handleInputChange}
                    name="enablePayments"
                  />

                  <ToggleSwitch
                    label="Test Mode"
                    description="Process payments in test mode (no real transactions)"
                    checked={settings.testMode}
                    onChange={handleInputChange}
                    name="testMode"
                  />

                  <div className="mt-4">
                    <h6 className="fw-semibold mb-3">Payment Methods</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.paymentMethods.upi}
                            onChange={handleInputChange}
                            name="paymentMethods.upi"
                          />
                          <label className="form-check-label fw-semibold">
                            UPI Payments
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.paymentMethods.creditCard}
                            onChange={handleInputChange}
                            name="paymentMethods.creditCard"
                          />
                          <label className="form-check-label fw-semibold">
                            Credit Cards
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.paymentMethods.debitCard}
                            onChange={handleInputChange}
                            name="paymentMethods.debitCard"
                          />
                          <label className="form-check-label fw-semibold">
                            Debit Cards
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.paymentMethods.netBanking}
                            onChange={handleInputChange}
                            name="paymentMethods.netBanking"
                          />
                          <label className="form-check-label fw-semibold">
                            Net Banking
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.paymentMethods.wallet}
                            onChange={handleInputChange}
                            name="paymentMethods.wallet"
                          />
                          <label className="form-check-label fw-semibold">
                            Digital Wallets
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.paymentMethods.cod}
                            onChange={handleInputChange}
                            name="paymentMethods.cod"
                          />
                          <label className="form-check-label fw-semibold">
                            Cash on Delivery
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Razorpay Key ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="razorpayKey"
                        value={settings.razorpayKey}
                        onChange={handleInputChange}
                        placeholder="rzp_test_..."
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Razorpay Secret
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="razorpaySecret"
                        value={settings.razorpaySecret}
                        onChange={handleInputChange}
                        placeholder="Your secret key"
                      />
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {/* Shipping Settings */}
            {activeTab === "shipping" && (
              <>
                <SettingsSection
                  title="Shipping Configuration"
                  description="Manage shipping methods and costs"
                  icon="shipping-fast"
                >
                  <ToggleSwitch
                    label="Enable Shipping"
                    description="Offer shipping to customers"
                    checked={settings.shippingEnabled}
                    onChange={handleInputChange}
                    name="shippingEnabled"
                  />

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Free Shipping Threshold (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="freeShippingThreshold"
                        value={settings.freeShippingThreshold}
                        onChange={handleInputChange}
                        min="0"
                      />
                      <div className="form-text">
                        Minimum order amount for free shipping
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Standard Shipping Cost (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="shippingCost"
                        value={settings.shippingCost}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Estimated Delivery Time
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="estimatedDelivery"
                        value={settings.estimatedDelivery}
                        onChange={handleInputChange}
                        placeholder="e.g., 3-5 business days"
                      />
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <>
                <SettingsSection
                  title="Notification Settings"
                  description="Configure how you receive notifications"
                  icon="bell"
                >
                  <h6 className="fw-semibold mb-3">Notification Channels</h6>

                  <ToggleSwitch
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                    name="emailNotifications"
                  />

                  <ToggleSwitch
                    label="SMS Notifications"
                    description="Receive notifications via SMS"
                    checked={settings.smsNotifications}
                    onChange={handleInputChange}
                    name="smsNotifications"
                  />

                  <ToggleSwitch
                    label="Push Notifications"
                    description="Receive push notifications in the admin panel"
                    checked={settings.pushNotifications}
                    onChange={handleInputChange}
                    name="pushNotifications"
                  />

                  <h6 className="fw-semibold mt-4 mb-3">Notification Types</h6>

                  <ToggleSwitch
                    label="Order Confirmations"
                    description="Notify when new orders are placed"
                    checked={settings.orderConfirmation}
                    onChange={handleInputChange}
                    name="orderConfirmation"
                  />

                  <ToggleSwitch
                    label="Shipping Updates"
                    description="Notify when order status changes"
                    checked={settings.shippingUpdates}
                    onChange={handleInputChange}
                    name="shippingUpdates"
                  />

                  <ToggleSwitch
                    label="Promotional Emails"
                    description="Send promotional emails to customers"
                    checked={settings.promotionalEmails}
                    onChange={handleInputChange}
                    name="promotionalEmails"
                  />
                </SettingsSection>
              </>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <>
                <SettingsSection
                  title="Security Settings"
                  description="Enhance the security of your admin panel"
                  icon="shield-alt"
                >
                  <ToggleSwitch
                    label="Two-Factor Authentication"
                    description="Require 2FA for admin login"
                    checked={settings.twoFactorAuth}
                    onChange={handleInputChange}
                    name="twoFactorAuth"
                  />

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="sessionTimeout"
                        value={settings.sessionTimeout}
                        onChange={handleInputChange}
                        min="5"
                        max="240"
                      />
                      <div className="form-text">
                        Automatically log out after inactivity
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="loginAttempts"
                        value={settings.loginAttempts}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                      />
                      <div className="form-text">
                        Lock account after failed attempts
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Password Policy
                      </label>
                      <select
                        className="form-select"
                        name="passwordPolicy"
                        value={settings.passwordPolicy}
                        onChange={handleInputChange}
                      >
                        <option value="basic">Basic (6+ characters)</option>
                        <option value="medium">
                          Medium (8+ characters, letters & numbers)
                        </option>
                        <option value="strong">
                          Strong (10+ characters, mixed case, numbers & symbols)
                        </option>
                      </select>
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {/* SEO Settings */}
            {activeTab === "seo" && (
              <>
                <SettingsSection
                  title="SEO Settings"
                  description="Optimize your store for search engines"
                  icon="search"
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="metaTitle"
                        value={settings.metaTitle}
                        onChange={handleInputChange}
                        maxLength="60"
                      />
                      <div className="form-text">
                        Recommended: 50-60 characters. Current:{" "}
                        {settings.metaTitle.length}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Meta Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="metaDescription"
                        value={settings.metaDescription}
                        onChange={handleInputChange}
                        maxLength="160"
                      />
                      <div className="form-text">
                        Recommended: 150-160 characters. Current:{" "}
                        {settings.metaDescription.length}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="metaKeywords"
                        value={settings.metaKeywords}
                        onChange={handleInputChange}
                        placeholder="comma-separated keywords"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="googleAnalytics"
                        value={settings.googleAnalytics}
                        onChange={handleInputChange}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Facebook Pixel ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="facebookPixel"
                        value={settings.facebookPixel}
                        onChange={handleInputChange}
                        placeholder="XXXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
