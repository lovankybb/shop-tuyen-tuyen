import { useState } from "react";
import "./Brand.css";

const initialBrands = [
  { id: 1, name: "Apple", slug: "apple", logo: "🍎", status: true },
  { id: 2, name: "Samsung", slug: "samsung", logo: "💎", status: true },
  { id: 3, name: "Xiaomi", slug: "xiaomi", logo: "⚡", status: true },
  { id: 4, name: "OPPO",slug: "oppo", logo: "🌸", status: false },
];

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
  const [brands, setBrands] = useState(initialBrands);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
  });

  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Vui lòng nhập tên thương hiệu";
    }

    if (!form.slug.trim()) {
      e.slug = "Vui lòng nhập slug";
    }

    return e;
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" && !editId
        ? {
            slug: value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          }
        : {}),
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: "",
      }));
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
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editId ? { ...b, ...form } : b
        )
      );

      setEditId(null);
    } else {
      setBrands((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          status: true,
        },
      ]);
    }

    setForm({
      name: "",
      slug: "",
      logo: "",
    });
  };

  const handleEdit = (brand) => {
    setEditId(brand.id);

    setForm({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
    });

    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Xoá thương hiệu này?")) {
      setBrands((prev) =>
        prev.filter((b) => b.id !== id)
      );
    }
  };

  const toggleStatus = (id) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: !b.status }
          : b
      )
    );
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="brand-page">
      <div className="brand-page-head">
        <div>
          <h1 className="brand-page-title">
            Thương hiệu
          </h1>

          <p className="brand-page-desc">
            Quản lý danh sách thương hiệu điện thoại
          </p>
        </div>

        <div className="brand-badge">
          {brands.length} thương hiệu
        </div>
      </div>

      <div className="brand-wrap">
        {/* TABLE */}
        <div className="brand-card">
          <div className="brand-card-head">
            <span className="brand-card-title">
              Danh sách
            </span>

            <input
              className="brand-search"
              placeholder="Tìm thương hiệu..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <table className="brand-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Tên</th>
                <th>Slug</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="brand-empty"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}

              {filtered.map((b) => (
                <tr key={b.id} className="brand-row">
                  <td className="brand-td">
                    <span className="brand-logo">
                      {b.logo || "📦"}
                    </span>
                  </td>

                  <td className="brand-td">
                    <span className="brand-name">
                      {b.name}
                    </span>
                  </td>

                  <td className="brand-td">
                    <code className="brand-slug">
                      {b.slug}
                    </code>
                  </td>

                  <td className="brand-td">
                    <button
                      onClick={() =>
                        toggleStatus(b.id)
                      }
                      className={`brand-status-btn ${
                        b.status
                          ? "brand-status-on"
                          : "brand-status-off"
                      }`}
                    >
                      {b.status ? "Hiện" : "Ẩn"}
                    </button>
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
                      onClick={() =>
                        handleDelete(b.id)
                      }
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
              {editId
                ? "Sửa thương hiệu"
                : "Thêm thương hiệu"}
            </span>

            {editId && (
              <button
                className="brand-cancel-btn"
                onClick={() => {
                  setEditId(null);

                  setForm({
                    name: "",
                    slug: "",
                    logo: "",
                  });

                  setErrors({});
                }}
              >
                Huỷ
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="brand-form"
          >
            <Field
              label="Tên thương hiệu *"
              error={errors.name}
            >
              <input
                className={`brand-input ${
                  errors.name
                    ? "brand-input-error"
                    : ""
                }`}
                placeholder="VD: Samsung"
                value={form.name}
                onChange={handleChange("name")}
              />
            </Field>

            <Field
              label="Slug *"
              error={errors.slug}
            >
              <input
                className={`brand-input ${
                  errors.slug
                    ? "brand-input-error"
                    : ""
                }`}
                placeholder="VD: samsung"
                value={form.slug}
                onChange={handleChange("slug")}
              />
            </Field>

            <Field label="Emoji / Logo">
              <input
                className="brand-input"
                placeholder="VD: 💎"
                value={form.logo}
                onChange={handleChange("logo")}
              />
            </Field>

            <button
              type="submit"
              className="brand-submit-btn"
            >
              <PlusIcon />

              {editId
                ? "Cập nhật"
                : "Thêm thương hiệu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="brand-field">
      <label className="brand-label">
        {label}
      </label>

      {children}

      {error && (
        <span className="brand-error-msg">
          {error}
        </span>
      )}
    </div>
  );
}