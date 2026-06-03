import { useEffect, useMemo, useState } from "react";
import "./Color.css";

import {
  createColor,
  deleteColor,
  getAllColors,
  updateColor,
} from "../../service/ColorService";

import SuccessPopup from "../Popup/SuccessPopup";
import ErrorPopup from "../Popup/ErrorPopup";
import ConfirmPopup from "../Popup/ConfirmPopup";


const PRESET_HEX = [
  "#1a1a1a",
  "#ffffff",
  "#f5f5f0",
  "#b0b8c1",
  "#c8a96e",
  "#92836a",
  "#2563eb",
  "#0891b2",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#ec4899",
  "#7c3aed",
  "#6b7280",
  "#1e293b",
  "#0f172a",
];

const EMPTY = { name: "", hex: "#000000", slug: "" };

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function Color() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState(EMPTY);

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const data = await getAllColors();
        setColors(data);
      } catch (error) {
        setErrorMsg("Lỗi khi tải danh sách màu");
        setErrorOpen(true);
      }
    };

    fetchColors();
  }, []);

  const handleChange = (k) => (e) => {
    const val = e.target.value;
    setForm((p) => ({
      ...p,
      [k]: val,
    }));

    if (errors[k]) {
      setErrors((p) => ({ ...p, [k]: "" }));
    }
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Vui lòng nhập tên màu";
    if (!form.hex.trim()) e.hex = "Vui lòng chọn mã màu";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (editId) {
      updateColor(editId, form)
        .then((updated) => {
          setColors((p) =>
            p.map((c) => (c.id === editId ? { ...c, ...updated } : c))
          );
          setSuccessMsg("Cập nhật màu sắc thành công");
          setSuccessOpen(true);
        })
        .catch(() => {
          setErrorMsg("Lỗi khi cập nhật màu sắc");
          setErrorOpen(true);
        })
        .finally(() => {
          setEditId(null);
        });
    } else {
      createColor(form)
        .then((created) => {
          setColors((p) => [...p, created]);
          setSuccessMsg("Thêm màu sắc thành công");
          setSuccessOpen(true);
        })
        .catch(() => {
          setErrorMsg("Lỗi khi thêm màu sắc");
          setErrorOpen(true);
        }); 
    }

    setForm(EMPTY);
    setErrors({});
  };

  const handleEdit = (c) => {
    setEditId(c.id);

    setForm({
      name: c.name,
      hex: c.hex,
    });

    setErrors({});
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY);
    setErrors({});
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteColor(deleteId)
        .then(() => {
          setColors((p) => p.filter((c) => c.id !== deleteId));
          setSuccessMsg("Xóa màu sắc thành công");
          setSuccessOpen(true);
        })
        .catch(() => {
          setErrorMsg("Lỗi khi xóa màu sắc");
          setErrorOpen(true);
        })
        .finally(() => {
          setDeleteId(null);
        }); 
    }
  };

  const filtered = useMemo(() => {
    return colors.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) 
    );
  }, [colors, search]);

  const isLight = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  };

  return (
    <>
      <div className="color-page">
        <div className="color-page-head">
          <div>
            <h1 className="color-page-title">Màu sắc</h1>
            <p className="color-page-desc">Quản lý bảng màu sắc sản phẩm</p>
          </div>

          <div className="color-badge">{colors.length} màu sắc</div>
        </div>

        <div className="color-layout">
          {/* TABLE */}
          <div className="color-card">
            <div className="color-card-head">
              <span className="color-card-title">Danh sách màu</span>

              <input
                className="color-input color-search"
                placeholder="Tìm tên, hex"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="color-table">
              <thead>
                <tr>
                  {["Màu", "Tên", "Mã HEX", ""].map((h) => (
                    <th key={h} className="color-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="color-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}

                {filtered.map((c) => (
                  <tr key={c.id} className="color-row">
                    <td className="color-td">
                      <div
                        className="color-swatch"
                        style={{
                          background: c.hex,
                          border: isLight(c.hex)
                            ? "1.5px solid #e0e0e0"
                            : "none",
                        }}
                      />
                    </td>

                    <td className="color-td">
                      <span className="color-name">{c.name}</span>
                    </td>

                    <td className="color-td">
                      <div className="color-hex-cell">
                        <span
                          className="color-hex-dot"
                          style={{
                            background: c.hex,
                            border: isLight(c.hex)
                              ? "1px solid #e0e0e0"
                              : "none",
                          }}
                        />

                        <code className="color-hex-code">
                          {c.hex.toUpperCase()}
                        </code>
                      </div>
                    </td>

                    <td className="color-td color-action-cell">
                      <button
                        className="color-icon-btn"
                        onClick={() => handleEdit(c)}
                      >
                        <EditIcon />
                      </button>

                      <button
                        className="color-icon-btn color-icon-red"
                        onClick={() => {
                          setDeleteId(c.id);
                          setConfirmOpen(true);
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="color-palette">
              <span className="color-palette-label">Palette hiện tại</span>

              <div className="color-palette-row">
                {colors.map((c) => (
                  <div
                    key={c.id}
                    title={`${c.name} · ${c.hex}`}
                    className="color-palette-dot"
                    style={{
                      background: c.hex,
                      border: isLight(c.hex) ? "1.5px solid #e0e0e0" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="color-card">
            <div className="color-card-head">
              <span className="color-card-title">
                {editId ? "Sửa màu sắc" : "Thêm màu sắc"}
              </span>

              {editId && (
                <button className="color-cancel-btn" onClick={handleCancel}>
                  Huỷ
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="color-form">
              <div className="color-picker-row">
                <div>
                  <label className="color-label">Chọn màu *</label>

                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={form.hex}
                      onChange={handleChange("hex")}
                      className="color-picker"
                    />

                    <div
                      className="color-picker-preview"
                      style={{
                        background: form.hex,
                        border: isLight(form.hex)
                          ? "1.5px solid #e0e0e0"
                          : "none",
                      }}
                    />
                  </div>

                  {errors.hex && (
                    <span className="color-error">{errors.hex}</span>
                  )}
                </div>

                <div className="color-flex-1">
                  <label className="color-label">Mã HEX</label>

                  <input
                    className={`color-input ${
                      errors.hex ? "color-input-error" : ""
                    }`}
                    placeholder="#000000"
                    value={form.hex}
                    onChange={handleChange("hex")}
                    maxLength={7}
                  />
                </div>
              </div>

              <div>
                <label className="color-label">Màu gợi ý</label>

                <div className="color-preset-grid">
                  {PRESET_HEX.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={hex}
                      className="color-preset-dot"
                      onClick={() => setForm((p) => ({ ...p, hex }))}
                      style={{
                        background: hex,
                        border:
                          form.hex === hex
                            ? "2.5px solid #2563eb"
                            : isLight(hex)
                              ? "1.5px solid #e0e0e0"
                              : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="color-label">Tên màu *</label>

                <input
                  className={`color-input ${
                    errors.name ? "color-input-error" : ""
                  }`}
                  placeholder="VD: Xanh dương đậm"
                  value={form.name}
                  onChange={handleChange("name")}
                />

                {errors.name && (
                  <span className="color-error">{errors.name}</span>
                )}
              </div>

              {form.name && (
                <div className="color-preview-card">
                  <div
                    className="color-preview-box"
                    style={{
                      background: form.hex,
                      border: isLight(form.hex)
                        ? "1.5px solid #e0e0e0"
                        : "none",
                    }}
                  />

                  <div>
                    <div className="color-preview-name">{form.name}</div>

                    <div className="color-preview-info">
                      {form.hex.toUpperCase()} · {form.slug}
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="color-submit-btn">
                <PlusIcon />
                {editId ? "Cập nhật màu" : "Thêm màu sắc"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ConfirmPopup
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={()=> {
          handleDelete();
          setConfirmOpen(false);
        }}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa màu sắc này? Hành động này không thể hoàn tác."  
      />

      <SuccessPopup
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Thành công"
        message={successMsg}
      />

      <ErrorPopup
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
        title="Lỗi"
        message={errorMsg}
      />
    </>
  );
}
