import { useEffect, useState } from "react";
import "./UpdateProduct.css";

// Giả định bạn có hàm getProductById và updateProduct trong ProductService
import { getProductById, updateProduct } from "../../service/ProductService";
import { getAllBrands } from "../../service/BrandService";
import { getAllCategories } from "../../service/CategoryService";
import { CloudinaryService } from "../../service/CloudinaryService";
import { getAllColors } from "../../service/ColorService";
import { getVersions } from "../../service/VersionService";

import ConfirmPopup from "../Popup/ConfirmPopup";

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Đang bán",
    desc: "Hiển thị & có thể mua",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
  },
  {
    value: "draft",
    label: "Bản nháp",
    desc: "Lưu nhưng chưa đăng",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
  },
  {
    value: "archived",
    label: "Lưu trữ",
    desc: "Ẩn khỏi cửa hàng",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#cbd5e1",
  },
];

/* ── Helper components ── */
const Field = ({ label, required, error, hint, children }) => (
  <div className="up-field">
    <div className="up-field-top">
      <label className="up-label">
        {label}
        {required && <span className="up-req"> *</span>}
      </label>
      {hint && <span className="up-hint">{hint}</span>}
    </div>
    {children}
    {error && (
      <span className="up-err-msg">
        <ErrIcon /> {error}
      </span>
    )}
  </div>
);

const Section = ({ title, icon, accent = "#2563eb", children }) => (
  <div className="up-card">
    <div className="up-card-head" style={{ borderLeft: `3px solid ${accent}` }}>
      <span className="up-card-head-icon">{icon}</span>
      <span className="up-card-title">{title}</span>
    </div>
    <div className="up-card-body">{children}</div>
  </div>
);

/* ══ MAIN ══ */
export default function UpdateProduct({ productId, onSuccess, onCancel }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const [data, setData] = useState({
    brands: [],
    categories: [],
    colors: [],
    versions: [],
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    salePrice: "",
    slug: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    status: "active",
  });

  const [colors, setColors] = useState([]);
  const [versions, setVersions] = useState([]);
  const [images, setImages] = useState([]); // Array chứa object { url, file?, isOld }
  const [coverIdx, setCoverIdx] = useState(0);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 1. Fetch Master Data
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [b, c, cl, v] = await Promise.all([
          getAllBrands(),
          getAllCategories(),
          getAllColors(),
          getVersions(),
        ]);
        setData({ brands: b, categories: c, colors: cl, versions: v });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Fetch Product Data
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setInitLoading(true);
      try {
        const prod = await getProductById(productId);
        if (prod) {
          setForm({
            name: prod.name || "",
            description: prod.description || "",
            salePrice: prod.salePrice || "",
            slug: prod.slug || "",
            price: prod.price || "",
            brand: prod.brand?.id || prod.brand || "",
            category: prod.category?.id || prod.category || "",
            stock: prod.stock !== undefined ? prod.stock : "",
            status: prod.status || "active",
          });

          // Xử lý list object (dựa theo ID)
          if (prod.colors) setColors(prod.colors);
          if (prod.versions) setVersions(prod.versions);

          // Xử lý ảnh cũ (hiển thị URL)
          if (prod.images && prod.images.length > 0) {
            const oldImages = prod.images.map((imgUrl) => ({
              url: imgUrl,
              isOld: true,
            }));
            setImages(oldImages);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setInitLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const toggleArr = (setter, arr, item) => {
    const exists = arr.find((x) => x.id === item.id);
    setter(exists ? arr.filter((x) => x.id !== item.id) : [...arr, item]);
    setErrors((p) => ({ ...p, colors: "", versions: "" }));
  };

  // Quản lý ảnh (Cũ + Mới)
  const handleImages = (files) => {
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    const newImgs = validFiles.map((file) => ({
      url: URL.createObjectURL(file), // Tạo URL tạm để preview
      file, // Lưu file để upload
      isOld: false,
    }));
    setImages((p) => [...p, ...newImgs]);
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
    if (!form.name.trim()) e.name = "Vui lòng nhập tên sản phẩm";
    if (!form.salePrice) e.salePrice = "Vui lòng nhập giá mới";
    else if (isNaN(+form.salePrice)) e.salePrice = "Giá không hợp lệ";
    if (form.price && isNaN(+form.price)) e.price = "Giá không hợp lệ";
    if (!form.brand) e.brand = "Chọn thương hiệu";
    if (!form.category) e.category = "Chọn danh mục";
    if (form.stock === "") e.stock = "Nhập số lượng tồn kho";
    if (colors.length === 0) e.colors = "Chọn ít nhất một màu";
    if (versions.length === 0) e.versions = "Chọn ít nhất một phiên bản";
    return e;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    try {
      // 1. Upload ảnh mới (nếu có)
      const uploadedUrls = await Promise.all(
        images.map(async (img) => {
          if (img.isOld) return img.url; // Giữ nguyên URL cũ
          return await CloudinaryService.uploadImage(img.file); // Upload file mới
        })
      );

      // Đưa ảnh cover lên đầu mảng
      if (coverIdx > 0 && uploadedUrls.length > 1) {
        const coverUrl = uploadedUrls.splice(coverIdx, 1)[0];
        uploadedUrls.unshift(coverUrl);
      }

      // 2. Chuẩn bị payload
      const payload = {
        ...form,
        slug: form.name.toLowerCase().replace(/ /g, "-"),
        images: uploadedUrls,
        colors: colors.map((c) => c.id), // Chỉ gửi mảng ID cho backend (tuỳ theo API của bạn)
        versions: versions.map((v) => v.id),
      };

      // 3. Gọi API Update
      const updatedProduct = await updateProduct(productId, payload);
      onSuccess?.(updatedProduct.id);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const fmtPreview = (v) => (v ? (+v).toLocaleString("vi-VN") + "₫" : "—");
  const discount =
    form.salePrice && form.price && +form.price > +form.salePrice
      ? Math.round((1 - +form.salePrice / +form.price) * 100)
      : null;

  if (initLoading) {
    return (
      <div className="up-loading-screen">
        <span className="up-spinner large"></span> Đang tải thông tin...
      </div>
    );
  }

  return (
    <>
      <div className="up-page">
        {/* Top bar */}
        <div className="up-top-bar">
          <div>
            <h1 className="up-page-title">Cập nhật sản phẩm</h1>
            <p className="up-page-desc">
              Chỉnh sửa thông tin cho sản phẩm: <strong>{form.name}</strong>
            </p>
          </div>
          <div className="up-actions">
            {onCancel && (
              <button className="up-btn-ghost" onClick={onCancel}>
                ← Quay lại
              </button>
            )}
            <button
              className="up-btn-primary"
              style={{ opacity: loading ? 0.75 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="up-spinner" /> Đang lưu...
                </>
              ) : (
                <>
                  <SaveIco /> Cập nhật
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="up-layout">
            {/* ══ LEFT ══ */}
            <div className="up-col">
              {/* Thông tin cơ bản */}
              <Section title="Thông tin cơ bản" icon="📋" accent="#2563eb">
                <Field label="Tên sản phẩm" required error={errors.name}>
                  <input
                    className={`up-inp ${errors.name ? "up-inp-err" : ""}`}
                    placeholder="VD: iPhone 16 Pro Max..."
                    value={form.name}
                    onChange={set("name")}
                  />
                </Field>
                <Field label="Mô tả sản phẩm" hint="Tối đa 2000 ký tự">
                  <textarea
                    className="up-textarea"
                    placeholder="Nhập mô tả chi tiết..."
                    rows={5}
                    value={form.description}
                    onChange={set("description")}
                  />
                </Field>
              </Section>

              {/* Giá */}
              <Section title="Thông tin giá" icon="💰" accent="#16a34a">
                <div className="up-grid-2">
                  <Field
                    label="Giá mới (bán ra)"
                    required
                    error={errors.salePrice}
                  >
                    <div className="up-addon-wrap">
                      <span className="up-addon">₫</span>
                      <input
                        className={`up-inp up-inp-addon ${errors.salePrice ? "up-inp-err" : ""}`}
                        type="number"
                        min="0"
                        value={form.salePrice}
                        onChange={set("salePrice")}
                      />
                    </div>
                  </Field>
                  <Field
                    label="Giá cũ (gốc)"
                    error={errors.price}
                    hint="Để tính % giảm"
                  >
                    <div className="up-addon-wrap">
                      <span className="up-addon">₫</span>
                      <input
                        className={`up-inp up-inp-addon ${errors.price ? "up-inp-err" : ""}`}
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={set("price")}
                      />
                    </div>
                  </Field>
                </div>
                {(form.salePrice || form.price) && (
                  <div className="up-price-row">
                    <span className="up-price-label">Xem trước:</span>
                    <span className="up-price-new">
                      {fmtPreview(form.salePrice)}
                    </span>
                    {form.price && (
                      <span className="up-price-old">
                        {fmtPreview(form.price)}
                      </span>
                    )}
                    {discount && <span className="up-disc">-{discount}%</span>}
                  </div>
                )}
              </Section>

              {/* Màu sắc */}
              <Section title="Màu sắc" icon="🎨" accent="#7c3aed">
                {errors.colors && (
                  <p className="up-err-msg">
                    <ErrIcon /> {errors.colors}
                  </p>
                )}
                <div className="up-color-grid">
                  {data.colors.map((c) => {
                    const on = colors.some((col) => col.id === c.id);
                    return (
                      <label
                        key={c.id}
                        className={`up-color-item ${on ? "up-color-on" : ""}`}
                        style={on ? { borderColor: c.hex } : {}}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          style={{ display: "none" }}
                          onChange={() => toggleArr(setColors, colors, c)}
                        />
                        <span
                          className="up-color-dot"
                          style={{
                            background: c.hex,
                            border: c.hex === "#f5f5f0" ? "1.5px solid #d1d5db" : "none",
                          }}
                        />
                        <span className="up-color-label">{c.name}</span>
                        {on && (
                          <span
                            className="up-color-check-badge"
                            style={{
                              background: c.hex === "#f5f5f0" ? "#2563eb" : c.hex,
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </Section>

              {/* Phiên bản */}
              <Section title="Phiên bản / Dung lượng" icon="💾" accent="#d97706">
                {errors.versions && (
                  <p className="up-err-msg">
                    <ErrIcon /> {errors.versions}
                  </p>
                )}
                <div className="up-ver-grid">
                  {data.versions.map((v) => {
                    const on = versions.some((ver) => ver.id === v.id);
                    return (
                      <label
                        key={v.id}
                        className={`up-ver-item ${on ? "up-ver-on" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          style={{ display: "none" }}
                          onChange={() => toggleArr(setVersions, versions, v)}
                        />
                        {on && <span className="up-ver-check">✓ </span>}
                        {v.name}
                      </label>
                    );
                  })}
                </div>
              </Section>

              {/* Ảnh */}
              <Section title="Hình ảnh sản phẩm" icon="🖼️" accent="#0891b2">
                <div
                  className="up-drop"
                  onClick={() => document.getElementById("up-file").click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImages(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <UploadIco />
                  <p className="up-drop-title">
                    Kéo ảnh vào đây hoặc <span>chọn file mới</span>
                  </p>
                  <p className="up-drop-hint">PNG · JPG · WEBP — Tối đa 10MB/ảnh</p>
                  <input
                    id="up-file"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => handleImages(e.target.files)}
                  />
                </div>
                {images.length > 0 && (
                  <>
                    <div className="up-img-grid">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="up-img-card"
                          style={{
                            border: i === coverIdx ? "2px solid #2563eb" : "2px solid transparent",
                          }}
                        >
                          <img src={img.url} alt="" className="up-img-thumb" />
                          {i === coverIdx && (
                            <div className="up-cover-badge">Bìa</div>
                          )}
                          {!img.isOld && <div className="up-new-badge">Mới</div>}
                          <div className="up-img-overlay">
                            <button
                              type="button"
                              className="up-img-btn"
                              onClick={() => setCoverIdx(i)}
                            >
                              ⭐
                            </button>
                            <button
                              type="button"
                              className="up-img-btn"
                              style={{ background: "#dc2626" }}
                              onClick={() => removeImg(i)}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Section>
            </div>

            {/* ══ RIGHT ══ */}
            <div className="up-col">
              {/* Phân loại */}
              <Section title="Phân loại sản phẩm" icon="🏷️" accent="#2563eb">
                <Field label="Thương hiệu" required error={errors.brand}>
                  <select
                    className={`up-sel ${errors.brand ? "up-inp-err" : ""}`}
                    value={form.brand}
                    onChange={set("brand")}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {data.brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Danh mục" required error={errors.category}>
                  <select
                    className={`up-sel ${errors.category ? "up-inp-err" : ""}`}
                    value={form.category}
                    onChange={set("category")}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </Section>

              {/* Tồn kho */}
              <Section title="Tồn kho" icon="📦" accent="#16a34a">
                <Field label="Số lượng tồn kho" required error={errors.stock}>
                  <input
                    className={`up-inp ${errors.stock ? "up-inp-err" : ""}`}
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={set("stock")}
                  />
                </Field>
              </Section>

              {/* Trạng thái */}
              <Section title="Trạng thái" icon="🔘" accent="#7c3aed">
                {STATUS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="up-status-card"
                    style={{
                      borderColor: form.status === opt.value ? opt.border : "#e5e7eb",
                      background: form.status === opt.value ? opt.bg : "#fff",
                    }}
                  >
                    <input
                      type="radio"
                      name="up-status"
                      value={opt.value}
                      className="up-status-radio"
                      checked={form.status === opt.value}
                      onChange={set("status")}
                      style={{ accentColor: opt.color }}
                    />
                    <div>
                      <div
                        className="up-status-name"
                        style={{ color: form.status === opt.value ? opt.color : "#333" }}
                      >
                        {opt.label}
                      </div>
                      <div className="up-status-desc">{opt.desc}</div>
                    </div>
                    {form.status === opt.value && (
                      <span className="up-status-check" style={{ color: opt.color }}>
                        ✓
                      </span>
                    )}
                  </label>
                ))}
              </Section>

              {/* Submit */}
              <Section title="Hành động" icon="🚀" accent="#0891b2">
                <button
                  className="up-btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    opacity: loading ? 0.75 : 1,
                  }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="up-spinner" /> Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <SaveIco /> Lưu cập nhật
                    </>
                  )}
                </button>
              </Section>
            </div>
          </div>
        </form>
      </div>

      <ConfirmPopup
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
        title="Huỷ cập nhật"
        message="Các thay đổi của bạn sẽ không được lưu. Bạn có chắc muốn huỷ?"
        onConfirm={onCancel}
      />
    </>
  );
}

/* ── Micro SVG ── */
const SaveIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const UploadIco = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);
const ErrIcon = () => (
  <svg className="up-err-svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);