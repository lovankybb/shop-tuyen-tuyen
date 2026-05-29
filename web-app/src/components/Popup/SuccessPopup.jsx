import { useState } from "react";
import "./Popup.css";

/**
 * Popup
 *
 * Props:
 *   isOpen        {boolean}  — controls visibility
 *   message       {string}   — body message shown under the title
 *   title         {string}   — heading (default: "Thành công!")
 *   primaryLabel  {string}   — primary button text (default: "Tiếp tục")
 *   secondaryLabel{string}   — secondary button text (default: "Đóng")
 *   onPrimary     {function} — callback for primary button
 *   onClose       {function} — callback for close / secondary button
 */
export default function SuccessPopup({
  isOpen = false,
  message = "Thao tác của bạn đã được thực hiện thành công.",
  title = "Thành công!",
  primaryLabel = "Đóng",
  onClose,
}) {
  const [hiding, setHiding] = useState(false);

  if (!isOpen && !hiding) return null;

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
      onClose?.();
    }, 300);
  };


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className={`sp-backdrop${hiding ? " sp-hiding" : ""}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sp-title"
    >
      <div className="sp-card">
        <button className="sp-close" onClick={handleClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Animated icon */}
        <div className="sp-icon-wrap">
          <div className="sp-ring" />
          <div className="sp-ring-2" />
          <svg className="sp-circle-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#00c878" />
                <stop offset="100%" stopColor="#007AFF" />
              </linearGradient>
              <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#00c878" />
                <stop offset="100%" stopColor="#00e8a0" />
              </linearGradient>
            </defs>
            <circle className="sp-circle-bg" cx="44" cy="44" r="40" />
            <circle className="sp-circle-stroke" cx="44" cy="44" r="25" />
            <polyline className="sp-check" points="30,44 40,54 58,34" />
          </svg>
        </div>

        {/* Badge */}
        <div className="sp-badge">
          <span className="sp-badge-dot" />
          Xác nhận
        </div>

        {/* Text */}
        <h2 className="sp-title" id="sp-title">{title}</h2>
        <p className="sp-message">{message}</p>

        {/* Actions */}
        <div className="sp-actions">
          <button className="sp-btn-primary" onClick={handleClose}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}