import { useState } from "react";
import "./CreateProduct.css"; // Đảm bảo đường dẫn này đúng cấu trúc thư mục của bạn

/* ── Static data ── */
const BRANDS     = ["Apple", "Samsung", "Xiaomi", "OPPO", "Google", "Vivo", "Realme", "OnePlus"];
const CATEGORIES = ["Điện thoại flagship", "Tầm trung", "Giá rẻ", "Gaming Phone", "Điện thoại gập"];
const TYPES      = ["Điện thoại", "Máy tính bảng", "Phụ kiện", "Đồng hồ thông minh", "Tai nghe"];

const COLOR_OPTIONS = [
  { id: "black",    label: "Đen",       hex: "#1a1a1a" },
  { id: "white",    label: "Trắng",     hex: "#f5f5f0" },
  { id: "gold",     label: "Vàng",      hex: "#c8a96e" },
  { id: "silver",   label: "Bạc",       hex: "#b0b8c1" },
  { id: "blue",     label: "Xanh dương",hex: "#2563eb" },
  { id: "green",    label: "Xanh lá",   hex: "#16a34a" },
  { id: "purple",   label: "Tím",       hex: "#7c3aed" },
  { id: "red",      label: "Đỏ",        hex: "#dc2626" },
  { id: "pink",     label: "Hồng",      hex: "#ec4899" },
  { id: "titanium", label: "Titan",     hex: "#6b7280" },
  { id: "natural",  label: "Tự nhiên",  hex: "#92836a" },
  { id: "midnight", label: "Midnight",  hex: "#1e293b" },
];

const VERSION_OPTIONS = [
  { id: "64gb",  label: "64 GB"    },
  { id: "128gb", label: "128 GB"   },
  { id: "256gb", label: "256 GB"   },
  { id: "512gb", label: "512 GB"   },
  { id: "1tb",   label: "1 TB"     },
  { id: "6ram",  label: "6 GB RAM" },
  { id: "8ram",  label: "8 GB RAM" },
  { id: "12ram", label: "12 GB RAM"},
  { id: "16ram", label: "16 GB RAM"},
];

const STATUS_OPTIONS = [
  { value: "active",   label: "Đang bán",  desc: "Hiển thị & có thể mua", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
  { value: "draft",    label: "Bản nháp",  desc: "Lưu nhưng chưa đăng",  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  { value: "archived", label: "Lưu trữ",   desc: "Ẩn khỏi cửa hàng",      color: "#64748b", bg: "#f8fafc", border: "#cbd5e1" },
];

/* ── Helper components ── */
const Field = ({ label, required, error, hint, children }) => (
  <div className="cp-field">
    <div className="cp-field-top">
      <label className="cp-label">
        {label}{required && <span className="cp-req"> *</span>}
      </label>
      {hint && <span className="cp-hint">{hint}</span>}
    </div>
    {children}
    {error && (
      <span className="cp-err-msg">
        <ErrIcon /> {error}
      </span>
    )}
  </div>
);

const Section = ({ title, icon, accent = "#2563eb", children }) => (
  <div className="cp-card">
    <div className="cp-card-head" style={{ borderLeft: `3px solid ${accent}` }}>
      <span className="cp-card-head-icon">{icon}</span>
      <span className="cp-card-title">{title}</span>
    </div>
    <div className="cp-card-body">{children}</div>
  </div>
);

/* ══ MAIN ══ */
export default function CreateProduct({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: "", description: "",
    newPrice: "", oldPrice: "",
    brand: "", category: "", type: "",
    stock: "", status: "active",
  });
  const [colors,   setColors]   = useState([]);
  const [versions, setVersions] = useState([]);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [images,   setImages]   = useState([]);
  const [coverIdx, setCoverIdx] = useState(0);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const toggleArr = (setter, arr, id) => {
    setter(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
    setErrors((p) => ({ ...p, colors: "", versions: "" }));
  };

  const handleImages = (files) => {
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setImages((p) => [...p, ...next]);
  };

  const removeImg = (i) => {
    setImages((p) => {
      const n = p.filter((_, idx) => idx !== i);
      if (coverIdx >= n.length) setCoverIdx(0);
      return n;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name     = "Vui lòng nhập tên sản phẩm";
    if (!form.newPrice)              e.newPrice = "Vui lòng nhập giá mới";
    else if (isNaN(+form.newPrice)) e.newPrice = "Giá không hợp lệ";
    if (form.oldPrice && isNaN(+form.oldPrice)) e.oldPrice = "Giá không hợp lệ";
    if (!form.brand)                e.brand    = "Chọn thương hiệu";
    if (!form.category)              e.category = "Chọn danh mục";
    if (!form.type)                  e.type     = "Chọn loại sản phẩm";
    if (!form.stock)                e.stock    = "Nhập số lượng tồn kho";
    if (colors.length === 0)        e.colors   = "Chọn ít nhất một màu";
    if (versions.length === 0)      e.versions = "Chọn ít nhất một phiên bản";
    return e;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onSuccess?.({ ...form, colors, versions, images });
  };

  const handleReset = () => {
    if (!window.confirm("Xoá tất cả nội dung đã nhập?")) return;
    setForm({ name:"",description:"",newPrice:"",oldPrice:"",brand:"",category:"",type:"",stock:"",status:"active" });
    setColors([]); setVersions([]); setImages([]); setErrors({});
  };

  const fmtPreview = (v) => v ? (+v).toLocaleString("vi-VN") + "₫" : "—";
  const discount = form.newPrice && form.oldPrice && +form.oldPrice > +form.newPrice
    ? Math.round((1 - +form.newPrice / +form.oldPrice) * 100) : null;

  return (
    <div className="cp-page">

      {/* Top bar */}
      <div className="cp-top-bar">
        <div>
          <h1 className="cp-page-title">Thêm sản phẩm mới</h1>
          <p className="cp-page-desc">Điền đầy đủ thông tin để tạo sản phẩm mới</p>
        </div>
        <div className="cp-actions">
          {onCancel && <button className="cp-btn-ghost" onClick={onCancel}>← Quay lại</button>}
          <button className="cp-btn-ghost" onClick={handleReset}>Xoá trắng</button>
          <button className="cp-btn-primary" style={{ opacity: loading ? 0.75 : 1 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="cp-spinner" /> Đang lưu...</> : <><SaveIco /> Lưu sản phẩm</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="cp-layout">

          {/* ══ LEFT ══ */}
          <div className="cp-col">

            {/* Thông tin cơ bản */}
            <Section title="Thông tin cơ bản" icon="📋" accent="#2563eb">
              <Field label="Tên sản phẩm" required error={errors.name}>
                <input className={`cp-inp ${errors.name ? "cp-inp-err" : ""}`}
                  placeholder="VD: iPhone 16 Pro Max 256GB Natural Titanium"
                  value={form.name} onChange={set("name")} />
              </Field>
              <Field label="Mô tả sản phẩm" hint="Tối đa 2000 ký tự">
                <textarea className="cp-textarea"
                  placeholder="Nhập mô tả chi tiết về tính năng, thiết kế, thông số kỹ thuật..."
                  rows={5} value={form.description} onChange={set("description")} />
              </Field>
            </Section>

            {/* Giá */}
            <Section title="Thông tin giá" icon="💰" accent="#16a34a">
              <div className="cp-grid-2">
                <Field label="Giá mới (bán ra)" required error={errors.newPrice}>
                  <div className="cp-addon-wrap">
                    <span className="cp-addon">₫</span>
                    <input className={`cp-inp cp-inp-addon ${errors.newPrice ? "cp-inp-err" : ""}`} type="number" min="0"
                      placeholder="34990000" value={form.newPrice} onChange={set("newPrice")} />
                  </div>
                </Field>
                <Field label="Giá cũ (gốc)" error={errors.oldPrice} hint="Để tính % giảm">
                  <div className="cp-addon-wrap">
                    <span className="cp-addon">₫</span>
                    <input className={`cp-inp cp-inp-addon ${errors.oldPrice ? "cp-inp-err" : ""}`} type="number" min="0"
                      placeholder="38990000" value={form.oldPrice} onChange={set("oldPrice")} />
                  </div>
                </Field>
              </div>
              {(form.newPrice || form.oldPrice) && (
                <div className="cp-price-row">
                  <span className="cp-price-label">Xem trước:</span>
                  <span className="cp-price-new">{fmtPreview(form.newPrice)}</span>
                  {form.oldPrice && <span className="cp-price-old">{fmtPreview(form.oldPrice)}</span>}
                  {discount && <span className="cp-disc">-{discount}%</span>}
                </div>
              )}
            </Section>

            {/* Màu sắc */}
            <Section title="Màu sắc" icon="🎨" accent="#7c3aed">
              {errors.colors && <p className="cp-err-msg"><ErrIcon /> {errors.colors}</p>}
              <div className="cp-color-grid">
                {COLOR_OPTIONS.map((c) => {
                  const on = colors.includes(c.id);
                  return (
                    <label key={c.id} className={`cp-color-item ${on ? "cp-color-on" : ""}`}
                      style={on ? { borderColor: c.hex } : {}}>
                      <input type="checkbox" checked={on} style={{ display: "none" }}
                        onChange={() => toggleArr(setColors, colors, c.id)} />
                      <span className="cp-color-dot" style={{ background: c.hex, border: c.hex === "#f5f5f0" ? "1.5px solid #d1d5db" : "none" }} />
                      <span className="cp-color-label">{c.label}</span>
                      {on && (
                        <span className="cp-color-check-badge" style={{ background: c.hex === "#f5f5f0" ? "#2563eb" : c.hex }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {colors.length > 0 && (
                <div className="cp-tag-row">
                  {colors.map((id) => {
                    const c = COLOR_OPTIONS.find((x) => x.id === id);
                    return (
                      <span key={id} className="cp-tag">
                        <span className="cp-tag-dot" style={{ background: c.hex }} />
                        {c.label}
                        <button type="button" className="cp-tag-x"
                          onClick={() => toggleArr(setColors, colors, id)}>×</button>
                      </span>
                    );
                  })}
                </div>
              )}
            </Section>

            {/* Phiên bản */}
            <Section title="Phiên bản / Dung lượng" icon="💾" accent="#d97706">
              {errors.versions && <p className="cp-err-msg"><ErrIcon /> {errors.versions}</p>}
              <div className="cp-ver-grid">
                {VERSION_OPTIONS.map((v) => {
                  const on = versions.includes(v.id);
                  return (
                    <label key={v.id} className={`cp-ver-item ${on ? "cp-ver-on" : ""}`}>
                      <input type="checkbox" checked={on} style={{ display: "none" }}
                        onChange={() => toggleArr(setVersions, versions, v.id)} />
                      {on && <span className="cp-ver-check">✓ </span>}
                      {v.label}
                    </label>
                  );
                })}
              </div>
              {versions.length > 0 && (
                <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                  Đã chọn <strong style={{ color: "#d97706" }}>{versions.length}</strong> phiên bản
                </p>
              )}
            </Section>

            {/* Ảnh */}
            <Section title="Hình ảnh sản phẩm" icon="🖼️" accent="#0891b2">
              <div className="cp-drop"
                onClick={() => document.getElementById("cp-file").click()}
                onDrop={(e) => { e.preventDefault(); handleImages(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}>
                <UploadIco />
                <p className="cp-drop-title">
                  Kéo ảnh vào đây hoặc <span>chọn file</span>
                </p>
                <p className="cp-drop-hint">PNG · JPG · WEBP — Tối đa 10MB/ảnh</p>
                <input id="cp-file" type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={(e) => handleImages(e.target.files)} />
              </div>
              {images.length > 0 && (
                <>
                  <div className="cp-img-grid">
                    {images.map((img, i) => (
                      <div key={i} className="cp-img-card"
                        style={{ border: i === coverIdx ? "2px solid #2563eb" : "2px solid transparent" }}>
                        <img src={img.url} alt="" className="cp-img-thumb" />
                        {i === coverIdx && <div className="cp-cover-badge">Bìa</div>}
                        <div className="cp-img-overlay">
                          <button type="button" className="cp-img-btn" onClick={() => setCoverIdx(i)}>⭐</button>
                          <button type="button" className="cp-img-btn" style={{ background: "#dc2626" }} onClick={() => removeImg(i)}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "12px", color: "#888" }}>{images.length} ảnh · Click ⭐ để chọn ảnh bìa</p>
                </>
              )}
            </Section>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="cp-col">

            {/* Phân loại */}
            <Section title="Phân loại sản phẩm" icon="🏷️" accent="#2563eb">
              <Field label="Thương hiệu" required error={errors.brand}>
                <select className={`cp-sel ${errors.brand ? "cp-inp-err" : ""}`}
                  value={form.brand} onChange={set("brand")}>
                  <option value="">-- Chọn thương hiệu --</option>
                  {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Danh mục" required error={errors.category}>
                <select className={`cp-sel ${errors.category ? "cp-inp-err" : ""}`}
                  value={form.category} onChange={set("category")}>
                  <option value="">-- Chọn danh mục --</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Loại sản phẩm" required error={errors.type}>
                <select className={`cp-sel ${errors.type ? "cp-inp-err" : ""}`}
                  value={form.type} onChange={set("type")}>
                  <option value="">-- Chọn loại --</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </Section>

            {/* Tồn kho */}
            <Section title="Tồn kho" icon="📦" accent="#16a34a">
              <Field label="Số lượng tồn kho" required error={errors.stock}>
                <input className={`cp-inp ${errors.stock ? "cp-inp-err" : ""}`} type="number" min="0"
                  placeholder="VD: 50" value={form.stock} onChange={set("stock")} />
              </Field>
              {form.stock !== "" && (
                <div className="cp-stock-badge" style={{
                  background: +form.stock === 0 ? "#fff5f5" : +form.stock <= 5 ? "#fffbeb" : "#f0fdf4",
                  border:     `1px solid ${+form.stock === 0 ? "#fecaca" : +form.stock <= 5 ? "#fde68a" : "#bbf7d0"}`,
                  color:      +form.stock === 0 ? "#dc2626" : +form.stock <= 5 ? "#d97706" : "#16a34a",
                }}>
                  {+form.stock === 0
                    ? "⚠️ Hết hàng"
                    : +form.stock <= 5
                    ? `⚠️ Sắp hết — còn ${form.stock} sản phẩm`
                    : `✓ Còn ${(+form.stock).toLocaleString("vi-VN")} sản phẩm`}
                </div>
              )}
            </Section>

            {/* Trạng thái */}
            <Section title="Trạng thái" icon="🔘" accent="#7c3aed">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className="cp-status-card" style={{
                  borderColor: form.status === opt.value ? opt.border : "#e5e7eb",
                  background:  form.status === opt.value ? opt.bg    : "#fff",
                }}>
                  <input type="radio" name="cp-status" value={opt.value} className="cp-status-radio"
                    checked={form.status === opt.value} onChange={set("status")}
                    style={{ accentColor: opt.color }} />
                  <div>
                    <div className="cp-status-name" style={{ color: form.status === opt.value ? opt.color : "#333" }}>
                      {opt.label}
                    </div>
                    <div className="cp-status-desc">{opt.desc}</div>
                  </div>
                  {form.status === opt.value && (
                    <span className="cp-status-check" style={{ color: opt.color }}>✓</span>
                  )}
                </label>
              ))}
            </Section>

            {/* Tóm tắt */}
            <Section title="Tóm tắt" icon="📊" accent="#0891b2">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  ["Tên SP",       form.name || "—"],
                  ["Giá mới",      fmtPreview(form.newPrice)],
                  ["Giá cũ",       fmtPreview(form.oldPrice)],
                  ["Giảm giá",     discount ? `${discount}%` : "—"],
                  ["Thương hiệu",  form.brand    || "—"],
                  ["Danh mục",     form.category || "—"],
                  ["Loại",         form.type     || "—"],
                  ["Tồn kho",      form.stock ? `${(+form.stock).toLocaleString("vi-VN")} sp` : "—"],
                  ["Màu sắc",      colors.length   ? `${colors.length} màu`      : "—"],
                  ["Phiên bản",    versions.length ? `${versions.length} phiên bản` : "—"],
                  ["Ảnh",          `${images.length} ảnh`],
                  ["Trạng thái",   STATUS_OPTIONS.find(x => x.value === form.status)?.label],
                ].map(([k, v]) => (
                  <div key={k} className="cp-sum-row">
                    <span className="cp-sum-key">{k}</span>
                    <span className="cp-sum-val">{v}</span>
                  </div>
                ))}
              </div>
              <button className="cp-btn-primary" style={{ width: "100%", marginTop: "14px", justifyContent: "center", opacity: loading ? 0.75 : 1 }}
                onClick={handleSubmit} disabled={loading}>
                {loading ? <><span className="cp-spinner" /> Đang lưu...</> : <><SaveIco /> Lưu sản phẩm</>}
              </button>
            </Section>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ── Micro SVG ── */
const SaveIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const UploadIco = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);
const ErrIcon = () => (
  <svg className="cp-err-svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);