import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import SuccessPopup from "../../components/Popup/SuccessPopup";
import ErrorPopup from "../../components/Popup/ErrorPopup";
import { login, register } from "../../service/AuthenticationService";
import { getMyProfile } from "../../service/UserService";
import { AuthContext } from "../../context/AuthContext";


const EyeIcon = ({ open }) =>
  open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const PhoneIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

export default function Authentication() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();
  const { login: setContextUser } = useContext(AuthContext) || { login: () => {} };

  const isRegister = mode === "register";

  const [isSuccessPopupOpen, setSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (form.password !== form.confirmPassword) {
           setErrorPopupOpen(true);
           return;
        }
        await register(form.username, form.email, form.password);
        setSuccessPopupOpen(true);
        setTimeout(() => switchMode("login"), 1500);
      } else {
        await login(form.username, form.password);
        try {
           const profile = await getMyProfile();
           const userRole = profile.role || "USER";
           localStorage.setItem("role", userRole);
           setContextUser(profile);
        } catch(err) {
           console.error("Could not fetch profile", err);
        }
        setSuccessPopupOpen(true);
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorPopupOpen(true);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setForm({ email: "", username: "", password: "", confirmPassword: "" });
  };

  return (
    <>
      <div className="auth-root">
      <div className="auth-bg">
        <div className="auth-bg-circle1" />
        <div className="auth-bg-circle2" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <PhoneIcon />
          </div>
          <div>
            <div className="auth-brand-name">NEXUS</div>
            <div className="auth-brand-tagline">Premium Mobile Store</div>
          </div>
        </div>

        <div className="auth-tab-bar">
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => switchMode(tab)}
              className={`auth-tab ${mode === tab ? "active" : ""}`}
            >
              {tab === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {isRegister && (
            <div className="auth-field-group">
              <label className="auth-label">Email</label>
              <div className={`auth-input-wrap ${focused === "email" ? "focused" : ""}`}>
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  className="auth-input"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label className="auth-label">Tên đăng nhập</label>
            <div className={`auth-input-wrap ${focused === "username" ? "focused" : ""}`}>
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Mật khẩu</label>
            <div className={`auth-input-wrap ${focused === "password" ? "focused" : ""}`}>
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                className="auth-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-eye-btn"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="auth-field-group">
              <label className="auth-label">Xác nhận mật khẩu</label>
              <div className={`auth-input-wrap ${focused === "confirmPassword" ? "focused" : ""}`}>
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused("")}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-eye-btn"
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
            </div>
          )}

          {!isRegister && (
            <div className="auth-forgot-row">
              <a href="#" className="auth-forgot-link">Quên mật khẩu?</a>
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            <span>{isRegister ? "Tạo tài khoản" : "Đăng nhập"}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">hoặc tiếp tục với</span>
            <span className="auth-divider-line" />
          </div>

          <div className="auth-social-row">
            {["Google"].map((provider) => (
              <button key={provider} type="button" className="auth-social-btn">
                {provider === "Google" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
                {provider}
              </button>
            ))}
          </div>
        </form>

        <p className="auth-switch-text">
          {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
          <button onClick={() => switchMode(isRegister ? "login" : "register")} className="auth-switch-link">
            {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
          </button>
        </p>
      </div>

      <div className="floating-icon floating-1">📱</div>
      <div className="floating-icon floating-2">⚡</div>
      <div className="floating-icon floating-3">✨</div>
    </div>
    <SuccessPopup isOpen={isSuccessPopupOpen} onClose={() => setSuccessPopupOpen(false)} />
      <ErrorPopup isOpen={isErrorPopupOpen} onClose={() => setErrorPopupOpen(false)} />
    </>
  );
}