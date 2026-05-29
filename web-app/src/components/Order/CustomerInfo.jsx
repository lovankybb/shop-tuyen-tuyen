import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

/**
 * CustomerInfo Component
 *
 * Props:
 *   isOpen       {boolean}   — hiển thị / ẩn layer
 *   onClose      {function}  — callback khi đóng layer
 *   title        {string}    — tiêu đề form
 *   description  {string}    — mô tả phụ dưới tiêu đề
 *   onSubmit     {function}  — callback khi submit, nhận vào object { ...formValues }
 */
export default function CustomerInfo({
  isOpen = false,
  onClose,
  title = "Thông tin khách hàng",
  description = "Điền đầy đủ thông tin bên dưới để tiếp tục.",
  onSubmit,
}) {
  const [hiding, setHiding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  if (!isOpen && !hiding) return null;

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
      setErrors({});
      onClose?.();
    }, 280);
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim())  newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!form.phone.trim())     newErrors.phone    = "Vui lòng nhập số điện thoại.";
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, "")))
                                newErrors.phone    = "Số điện thoại không hợp lệ.";
    if (!form.address.trim())   newErrors.address  = "Vui lòng nhập địa chỉ.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onSubmit?.(form);
    handleClose();
  };

  /* ── styles ── */
  const s = {
    backdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "20px",
      animation: hiding
        ? "fl-backdropOut 0.28s ease forwards"
        : "fl-backdropIn 0.25s ease forwards",
    },
    panel: {
      position: "relative",
      background: "rgba(15,17,26,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "460px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
      animation: hiding
        ? "fl-panelOut 0.28s ease forwards"
        : "fl-panelIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
    },
    shimmer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.7) 40%, rgba(88,86,214,0.7) 60%, transparent)",
      backgroundSize: "200% auto",
      animation: "fl-shimmer 3s linear infinite",
      borderRadius: "24px 24px 0 0",
    },
    header: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "28px 28px 0",
      gap: "16px",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    iconBox: {
      width: "46px",
      height: "46px",
      borderRadius: "13px",
      background: "linear-gradient(135deg, #007AFF, #5856D6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 6px 18px rgba(0,122,255,0.3)",
    },
    titleWrap: {},
    title: {
      fontSize: "18px",
      fontWeight: 800,
      color: "#fff",
      margin: 0,
      letterSpacing: "-0.01em",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    description: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.4)",
      margin: "4px 0 0",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    closeBtn: {
      width: "34px",
      height: "34px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.05)",
      color: "rgba(255,255,255,0.4)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s",
      padding: 0,
    },
    divider: {
      height: "1px",
      background: "rgba(255,255,255,0.07)",
      margin: "20px 0 0",
    },
    body: {
      padding: "24px 28px 28px",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
    },
    footer: {
      padding: "0 28px 28px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    infoBox: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      background: "rgba(0,122,255,0.07)",
      border: "1px solid rgba(0,122,255,0.18)",
      borderRadius: "10px",
      padding: "10px 14px",
      marginBottom: "4px",
    },
    infoText: {
      fontSize: "12.5px",
      color: "rgba(100,160,255,0.85)",
      lineHeight: 1.55,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
  };

  const iconPerson = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const iconPhone = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.1 6.1l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );

  const iconMap = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const iconNote = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );

  const iconSend = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes fl-backdropIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fl-backdropOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fl-panelIn {
          0%   { opacity: 0; transform: scale(0.88) translateY(20px); }
          70%  { opacity: 1; transform: scale(1.02) translateY(-3px); }
          100% {              transform: scale(1)    translateY(0); }
        }
        @keyframes fl-panelOut {
          from { opacity: 1; transform: scale(1)    translateY(0); }
          to   { opacity: 0; transform: scale(0.92) translateY(12px); }
        }
        @keyframes fl-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .fl-close-btn:hover {
          background: rgba(255,255,255,0.1) !important;
          color: rgba(255,255,255,0.8) !important;
        }
        .fl-panel::-webkit-scrollbar { width: 4px; }
        .fl-panel::-webkit-scrollbar-track { background: transparent; }
        .fl-panel::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
      `}</style>

      <div style={s.backdrop} onClick={handleBackdrop}>
        <div style={s.panel} className="fl-panel">

          <div style={s.shimmer} />

          {/* Header */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.iconBox}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div style={s.titleWrap}>
                <h2 style={s.title}>{title}</h2>
                <p style={s.description}>{description}</p>
              </div>
            </div>

            <button
              style={s.closeBtn}
              className="fl-close-btn"
              onClick={handleClose}
              aria-label="Đóng"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </div>

          <div style={s.divider} />

          {/* Form body */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={s.body}>
              <div style={s.row}>
                <Input
                  label="Họ và tên"
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  icon={iconPerson}
                  error={errors.fullName}
                  required
                />
                <Input
                  label="Số điện thoại"
                  name="phone"
                  placeholder="0912 345 678"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  icon={iconPhone}
                  error={errors.phone}
                  required
                />
              </div>

              <Input
                label="Địa chỉ giao hàng"
                name="address"
                placeholder="Số nhà, đường, phường, quận, tỉnh..."
                value={form.address}
                onChange={handleChange("address")}
                icon={iconMap}
                error={errors.address}
                required
              />

              <Input
                label="Ghi chú đơn hàng"
                name="note"
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                value={form.note}
                onChange={handleChange("note")}
                icon={iconNote}
              />
            </div>

            {/* Footer */}
            <div style={s.footer}>
              <div style={s.infoBox}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(100,160,255,0.7)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={s.infoText}>
                  Thông tin của bạn được bảo mật và chỉ dùng để xử lý đơn hàng tại NEXUS.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={iconSend}
                fullWidth
              >
                Xác nhận đặt hàng
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                fullWidth
              >
                Hủy bỏ
              </Button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}