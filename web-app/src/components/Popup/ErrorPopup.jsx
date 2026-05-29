import { useState } from "react";
import "./Popup.css";

/**
 * ErrorPopup
 *
 * Props:
 *   isOpen         {boolean}  — controls visibility
 *   message        {string}   — body message shown under the title
 *   title          {string}   — heading (default: "Đã xảy ra lỗi!")
 *   errorDetail    {string}   — optional error code / technical detail shown in mono box
 *   primaryLabel   {string}   — primary button text (default: "Thử lại")
 *   secondaryLabel {string}   — secondary button text (default: "Đóng")
 *   onPrimary      {function} — callback for primary button (retry)
 *   onClose        {function} — callback for close / secondary button
 */
export default function ErrorPopup({
  isOpen = false,
  message = "Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau.",
  title = "Đã xảy ra lỗi!",
  errorDetail,
  primaryLabel = "Đóng",
  onClose,
}) {
  const [hiding, setHiding] = useState(false);
  const [shake, setShake] = useState(true);

  if (!isOpen && !hiding) return null;

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
      setShake(true);
      onClose?.();
    }, 300);
  };



  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className={`ep-backdrop${hiding ? " ep-hiding" : ""}`}
      onClick={handleBackdropClick}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="ep-title"
      aria-describedby="ep-message"
    >
      <div className={`ep-card${shake ? " ep-shake" : ""}`}>

        <button className="ep-close" onClick={handleClose} aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Animated icon */}
        <div className="ep-icon-wrap">
          <div className="ep-ring" />
          <div className="ep-ring-2" />
          <svg className="ep-circle-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#ff3c3c" />
                <stop offset="100%" stopColor="#ff8c00" />
              </linearGradient>
              <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#ff7040" />
              </linearGradient>
            </defs>
            <circle className="ep-circle-bg" cx="44" cy="44" r="40" />
            <circle className="ep-circle-stroke" cx="44" cy="44" r="25" />
            <line className="ep-x-line1" x1="33" y1="33" x2="55" y2="55" />
            <line className="ep-x-line2" x1="55" y1="33" x2="33" y2="55" />
          </svg>
        </div>

        {/* Badge */}
        <div className="ep-badge">
          <span className="ep-badge-dot" />
          Lỗi hệ thống
        </div>

        {/* Text */}
        <h2 className="ep-title" id="ep-title">{title}</h2>
        <p className="ep-message" id="ep-message">{message}</p>

        {/* Optional error detail */}
        {errorDetail && (
          <div className="ep-detail">{errorDetail}</div>
        )}

        {/* Actions */}
        <div className="ep-actions">
          <button className="ep-btn-primary" onClick={handleClose}>
            {primaryLabel}
          </button>
        </div>

      </div>
    </div>
  );
}