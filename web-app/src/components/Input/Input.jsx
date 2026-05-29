import { useState } from "react";
import "./Input.css"; // Đảm bảo import đúng file CSS vừa tạo nha bro

/**
 * Input Component
 */
export default function Input({
  label,
  placeholder = "Nhập nội dung...",
  value = "",
  onChange,
  icon,
  error,
  disabled = false,
  required = false,
  name,
}) {
  const [focused, setFocused] = useState(false);

  // Tạo chuỗi className động cho khung input dựa trên trạng thái
  let inputRowClass = "input-row";
  if (disabled) inputRowClass += " is-disabled";
  else if (error) inputRowClass += " has-error";
  else if (focused) inputRowClass += " is-focused";

  return (
    <div className="input-wrapper">
      {label && (
        <label className={`input-label ${error ? "has-error" : ""}`}>
          {label}
          {required && (
            <span style={{ color: "#ff4d4d", marginLeft: "3px" }}>*</span>
          )}
        </label>
      )}

      <div className={inputRowClass}>
        {icon && <span className="input-icon-wrap">{icon}</span>}
        
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-element"
        />

        {error && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,0.8)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>

      {error && (
        <span className="input-error-msg">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}