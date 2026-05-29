import "./Button.css"; // Nhớ import đúng file CSS vừa tạo nha bro

/**
 * Button Component
 */
export default function Button({
  children,
  onClick,
  type = "submit",
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
}) {
  const isDisabled = disabled || loading;

  // Xử lý tạo danh sách class động
  const classNames = [
    "btn-element",
    `btn-${variant}`,
    fullWidth ? "btn-full-width" : "btn-auto-width"
  ].join(" ");

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={classNames}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          Đang xử lý...
        </>
      ) : (
        <>
          {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}