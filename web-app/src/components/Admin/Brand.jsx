import { useState, useRef, useMemo, useEffect } from "react";
import "./Brand.css";

import SuccessPopup from "../Popup/SuccessPopup";
import ErrorPopup from "../Popup/ErrorPopup";
import ConfirmPopup from "../Popup/ConfirmPopup";
import { CloudinaryService } from "../../service/CloudinaryService";

import {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} from "../../service/BrandService";

const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
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
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setErrorMsg("Lỗi khi tải danh sách thương hiệu");
        setErrorOpen(true);
      }
    };

    fetchBrands();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên thương hiệu";
    return e;
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (editId) {
      updateBrand(editId, form)
        .then((updated) => {
          setBrands((prev) =>
            prev.map((b) => (b.id === editId ? { ...b, ...updated } : b)),
          );
          setSuccessMsg("Cập nhật thương hiệu thành công");
          setSuccessOpen(true);
          setEditId(null);
        })
        .catch((err) => {
          setErrorMsg("Cập nhật thương hiệu thất bại");
          setErrorOpen(true);
        });
      setEditId(null);
    } else {

      CloudinaryService.uploadImage(form.logo)
        .then((imageUrl) => {
          return createBrand({ ...form, logo: imageUrl });
        })
        .then((created) => {
          setBrands((prev) => [...prev, created]);
          setSuccessMsg("Thêm thương hiệu thành công");
          setSuccessOpen(true);
        })
        .catch((err) => {
          setErrorMsg("Thêm thương hiệu thất bại");
          setErrorOpen(true);
        }); 
    }

    // Reset form
    setForm({ name: "", description: "", logo: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (brand) => {
    setEditId(brand.id);
    setForm({
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
    });
    setErrors({});
  };

  const handleDelete = () => {
    deleteBrand(deleteId)
      .then(() => {
        setBrands((prev) => prev.filter((b) => b.id !== deleteId));
        setSuccessMsg("Xoá thương hiệu thành công");
        setSuccessOpen(true);
      })
      .catch(() => {
        setErrorMsg("Xoá thương hiệu thất bại");
        setErrorOpen(true);
      });
    setDeleteId(null);
  };

  const filtered = useMemo(() => {
    return brands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [brands, search]);

  return (
    <>
      {" "}
      <div className="brand-page">
        <div className="brand-page-head">
          <div>
            <h1 className="brand-page-title">Thương hiệu</h1>
            <p className="brand-page-desc">
              Quản lý danh sách thương hiệu điện thoại
            </p>
          </div>
          <div className="brand-badge">{brands.length} thương hiệu</div>
        </div>

        <div className="brand-wrap">
          {/* TABLE */}
          <div className="brand-card">
            <div className="brand-card-head">
              <span className="brand-card-title">Danh sách</span>
              <input
                className="brand-search"
                placeholder="Tìm thương hiệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="brand-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="brand-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
                {filtered.map((b) => (
                  <tr key={b.id} className="brand-row">
                    <td className="brand-td">
                      {b.logo ? (
                        <img
                          src={b.logo}
                          alt={b.name}
                          className="brand-logo-img"
                        />
                      ) : (
                        <div className="brand-logo-placeholder">Trống</div>
                      )}
                    </td>
                    <td className="brand-td">
                      <span className="brand-name">{b.name}</span>
                    </td>
                    <td className="brand-td">
                      <span className="brand-desc-text">
                        {b.description || "—"}
                      </span>
                    </td>
                    <td className="brand-action-cell">
                      <button
                        className="brand-icon-btn"
                        onClick={() => handleEdit(b)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="brand-icon-btn brand-icon-btn-red"
                        onClick={() => {
                          setDeleteId(b.id);
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
          </div>

          {/* FORM */}
          <div className="brand-card">
            <div className="brand-card-head">
              <span className="brand-card-title">
                {editId ? "Sửa thương hiệu" : "Thêm thương hiệu"}
              </span>
              {editId && (
                <button
                  className="brand-cancel-btn"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", description: "", logo: "" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setErrors({});
                  }}
                >
                  Huỷ
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="brand-form">
              <Field label="Tên thương hiệu *" error={errors.name}>
                <input
                  className={`brand-input ${errors.name ? "brand-input-error" : ""}`}
                  placeholder="VD: Samsung"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </Field>

              <Field label="Mô tả">
                <textarea
                  className="brand-input"
                  placeholder="Nhập mô tả ngắn gọn..."
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                  style={{ resize: "vertical" }}
                />
              </Field>

              <Field label="Logo (Tải ảnh lên)">
                <input
                  type="file"
                  accept="image/*"
                  className="brand-input-file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {/* Hiển thị preview ảnh nếu đang có ảnh (sửa hoặc vừa upload) */}
                {form.logo && (
                  <div className="brand-preview-wrap">
                    <img
                      src={form.logo}
                      alt="Preview"
                      className="brand-preview-img"
                    />
                  </div>
                )}
              </Field>

              <button type="submit" className="brand-submit-btn">
                <PlusIcon />
                {editId ? "Cập nhật" : "Thêm thương hiệu"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ConfirmPopup
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          handleDelete();
          setConfirmOpen(false);
        }}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá thương hiệu này?"
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

function Field({ label, error, children }) {
  return (
    <div className="brand-field">
      <label className="brand-label">{label}</label>
      {children}
      {error && <span className="brand-error-msg">{error}</span>}
    </div>
  );
}
