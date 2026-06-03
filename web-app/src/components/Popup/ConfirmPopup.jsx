import { useState } from "react";
import "./Popup.css"; 

/**

 * ConfirmPopup

 *

 * Props:

 *   isOpen         {boolean}   — hiển thị / ẩn popup

 *   variant        {string}    — "danger" | "warning" | "info" (default: "danger")

 *   title          {string}    — tiêu đề xác nhận

 *   message        {string}    — nội dung mô tả hành động

 *   confirmLabel   {string}    — nhãn nút xác nhận (default tuỳ variant)

 *   cancelLabel    {string}    — nhãn nút huỷ (default: "Huỷ bỏ")

 *   confirmInput   {string}    — nếu có, user phải gõ đúng chuỗi này để kích hoạt nút xác nhận

 *   loading        {boolean}   — trạng thái loading khi đang xử lý

 *   onConfirm      {function}  — callback khi xác nhận

 *   onCancel       {function}  — callback khi huỷ / đóng

 */
export default function ConfirmPopup({
  isOpen = false,
  variant = "danger",
  title,
  message,
  confirmLabel,
  cancelLabel = "Huỷ bỏ",
  confirmInput,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const [hiding, setHiding] = useState(false);
  const [inputVal, setInputVal] = useState("");

  if (!isOpen && !hiding) return null;

  /* ── Config by variant ── */
  const config = {
    danger: {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      ),
      iconBg:      "#fff5f5",
      iconColor:   "#dc2626",
      ringColor:   "rgba(220,38,38,0.12)",
      badgeBg:     "#fff5f5",
      badgeColor:  "#dc2626",
      badgeBorder: "#fecaca",
      badgeLabel:  "Hành động nguy hiểm",
      btnBg:       "linear-gradient(135deg,#dc2626,#b91c1c)",
      btnShadow:   "rgba(220,38,38,0.3)",
      shimmer:     "rgba(220,38,38,0.6)",
      defaultLabel:"Xoá",
    },
    warning: {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      iconBg:      "#fffbeb",
      iconColor:   "#d97706",
      ringColor:   "rgba(217,119,6,0.12)",
      badgeBg:     "#fffbeb",
      badgeColor:  "#d97706",
      badgeBorder: "#fde68a",
      badgeLabel:  "Cần xác nhận",
      btnBg:       "linear-gradient(135deg,#d97706,#b45309)",
      btnShadow:   "rgba(217,119,6,0.3)",
      shimmer:     "rgba(217,119,6,0.6)",
      defaultLabel:"Xác nhận",
    },
    info: {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      iconBg:      "#eff6ff",
      iconColor:   "#2563eb",
      ringColor:   "rgba(37,99,235,0.12)",
      badgeBg:     "#eff6ff",
      badgeColor:  "#2563eb",
      badgeBorder: "#bfdbfe",
      badgeLabel:  "Thông báo",
      btnBg:       "linear-gradient(135deg,#2563eb,#1d4ed8)",
      btnShadow:   "rgba(37,99,235,0.3)",
      shimmer:     "rgba(37,99,235,0.6)",
      defaultLabel:"Đồng ý",
    },
  }[variant] || {};

  const finalLabel = confirmLabel || config.defaultLabel;
  const inputMatch = !confirmInput || inputVal === confirmInput;

  const close = (cb) => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
      setInputVal("");
      cb?.();
    }, 260);
  };

  const handleConfirm = () => {
    if (!inputMatch || loading) return;
    close(onConfirm);
  };

  const handleCancel = () => close(onCancel);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !loading) handleCancel();
  };

  return (
    <div
      onClick={handleBackdrop}
      className={`cp-backdrop ${hiding ? "out" : "in"}`}
    >
      {/* Card */}
      <div className={`cp-card ${hiding ? "out" : "in"}`}>

        {/* Top shimmer line */}
        <div 
          className="cp-shimmer-line"
          style={{
            background: `linear-gradient(90deg,transparent,${config.shimmer} 40%,${config.shimmer} 60%,transparent)`,
          }} 
        />

        {/* Body */}
        <div className="cp-body">

          {/* Icon with pulse ring */}
          <div className="cp-icon-wrapper">
            <div 
              className="cp-pulse-ring"
              style={{ border: `2px solid ${config.ringColor}` }} 
            />
            <div 
              className="cp-icon-box"
              style={{
                background: config.iconBg,
                color: config.iconColor,
                boxShadow: `0 4px 18px ${config.ringColor}`,
              }}
            >
              {config.icon}
            </div>
          </div>

          {/* Badge */}
          <div 
            className="cp-badge"
            style={{
              background: config.badgeBg,
              border: `1px solid ${config.badgeBorder}`,
              color: config.badgeColor,
            }}
          >
            <span 
              className="cp-badge-dot"
              style={{ 
                background: config.badgeColor, 
                boxShadow: `0 0 5px ${config.badgeColor}` 
              }} 
            />
            {config.badgeLabel}
          </div>

          {/* Title */}
          {title && <h2 className="cp-title">{title}</h2>}

          {/* Message */}
          {message && <p className="cp-message">{message}</p>}

          {/* Confirm input guard */}
          {confirmInput && (
            <div className="cp-input-group">
              <div className="cp-input-label">
                Gõ <strong className="cp-input-code">{confirmInput}</strong> để xác nhận:
              </div>
              <input
                className="cp-inp-check"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Nhập "${confirmInput}"`}
                style={{
                  border: `1px solid ${inputVal && !inputMatch ? "#f87171" : "#e0e0e0"}`,
                  animation: inputVal && !inputMatch ? "cp-shake 0.4s ease" : "none",
                }}
              />
              {inputVal && !inputMatch && (
                <span className="cp-input-error">Nội dung không khớp</span>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="cp-btn-container">
            <button
              className="cp-btn-confirm"
              onClick={handleConfirm}
              disabled={!inputMatch || loading}
              style={{
                background: config.btnBg,
                color: "#fff",
                boxShadow: inputMatch ? `0 6px 20px ${config.btnShadow}` : "none",
              }}
            >
              {loading ? (
                <>
                  <span className="cp-spin" />
                  Đang xử lý...
                </>
              ) : finalLabel}
            </button>

            <button
              className="cp-btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}