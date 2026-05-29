import { useState } from "react";
import "./Version.css";

const INIT_VERSIONS = [
  { id: 1, name: "64 GB", slug: "64gb", type: "storage", status: true },
  { id: 2, name: "128 GB", slug: "128gb", type: "storage", status: true },
  { id: 3, name: "256 GB", slug: "256gb", type: "storage", status: true },
  { id: 4, name: "512 GB", slug: "512gb", type: "storage", status: true },
  { id: 5, name: "1 TB", slug: "1tb", type: "storage", status: false },

  { id: 6, name: "6 GB RAM", slug: "6gb-ram", type: "ram", status: true },
  { id: 7, name: "8 GB RAM", slug: "8gb-ram", type: "ram", status: true },
  { id: 8, name: "12 GB RAM", slug: "12gb-ram", type: "ram", status: true },
  { id: 9, name: "16 GB RAM", slug: "16gb-ram", type: "ram", status: false },
];

const EMPTY = {
  name: "",
  slug: "",
  type: "storage",
};

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
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
    width="14"
    height="14"
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
    width="14"
    height="14"
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

export default function Version() {
  const [versions, setVersions] = useState(INIT_VERSIONS);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const autoSlug = (name) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleChange = (key) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" && !editId
        ? { slug: autoSlug(value) }
        : {}),
    }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) {
      err.name = "Vui lòng nhập tên phiên bản";
    }

    if (!form.slug.trim()) {
      err.slug = "Vui lòng nhập slug";
    }

    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    if (editId) {
      setVersions((prev) =>
        prev.map((v) =>
          v.id === editId
            ? { ...v, ...form }
            : v
        )
      );

      setEditId(null);
    } else {
      setVersions((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          status: true,
        },
      ]);
    }

    setForm(EMPTY);
    setErrors({});
  };

  const handleEdit = (version) => {
    setEditId(version.id);

    setForm({
      name: version.name,
      slug: version.slug,
      type: version.type,
    });

    setErrors({});
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa phiên bản này?")) {
      setVersions((prev) =>
        prev.filter((v) => v.id !== id)
      );
    }
  };

  const toggleStatus = (id) => {
    setVersions((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: !v.status }
          : v
      )
    );
  };

  const filtered = versions.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="version-page">

      {/* Header */}
      <div className="version-page-head">
        <div>
          <h1 className="version-page-title">
            Phiên bản
          </h1>

          <p className="version-page-desc">
            Quản lý dung lượng và RAM sản phẩm
          </p>
        </div>

        <div className="version-badge">
          {versions.length} phiên bản
        </div>
      </div>

      <div className="version-wrap">

        {/* TABLE */}
        <div className="version-card">

          <div className="version-card-head">
            <span className="version-card-title">
              Danh sách phiên bản
            </span>

            <input
              className="version-input version-search"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table className="version-table">
            <thead>
              <tr>
                <th className="version-th">Tên</th>
                <th className="version-th">Slug</th>
                <th className="version-th">Loại</th>
                <th className="version-th">Trạng thái</th>
                <th className="version-th"></th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="version-empty"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}

              {filtered.map((v) => (
                <tr key={v.id} className="version-tr">

                  <td className="version-td">
                    <span className="version-name">
                      {v.name}
                    </span>
                  </td>

                  <td className="version-td">
                    <code className="version-slug">
                      {v.slug}
                    </code>
                  </td>

                  <td className="version-td">
                    <span
                      className={`version-type ${
                        v.type === "ram"
                          ? "version-type-ram"
                          : "version-type-storage"
                      }`}
                    >
                      {v.type === "ram"
                        ? "RAM"
                        : "Dung lượng"}
                    </span>
                  </td>

                  <td className="version-td">
                    <button
                      onClick={() => toggleStatus(v.id)}
                      className={`version-status-btn ${
                        v.status
                          ? "version-status-on"
                          : "version-status-off"
                      }`}
                    >
                      {v.status ? "Hiện" : "Ẩn"}
                    </button>
                  </td>

                  <td className="version-td version-action-cell">
                    <button
                      className="version-icon-btn"
                      onClick={() => handleEdit(v)}
                    >
                      <EditIcon />
                    </button>

                    <button
                      className="version-icon-btn version-icon-red"
                      onClick={() => handleDelete(v.id)}
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
        <div className="version-card">

          <div className="version-card-head">
            <span className="version-card-title">
              {editId
                ? "Sửa phiên bản"
                : "Thêm phiên bản"}
            </span>

            {editId && (
              <button
                className="version-cancel-btn"
                onClick={handleCancel}
              >
                Huỷ
              </button>
            )}
          </div>

          <form
            className="version-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Name */}
            <div>
              <label className="version-label">
                Tên phiên bản *
              </label>

              <input
                className={`version-input ${
                  errors.name ? "version-input-error" : ""
                }`}
                placeholder="VD: 256 GB"
                value={form.name}
                onChange={handleChange("name")}
              />

              {errors.name && (
                <span className="version-error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="version-label">
                Slug *
              </label>

              <input
                className={`version-input ${
                  errors.slug ? "version-input-error" : ""
                }`}
                placeholder="VD: 256gb"
                value={form.slug}
                onChange={handleChange("slug")}
              />

              {errors.slug && (
                <span className="version-error">
                  {errors.slug}
                </span>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="version-label">
                Loại
              </label>

              <select
                className="version-input"
                value={form.type}
                onChange={handleChange("type")}
              >
                <option value="storage">
                  Dung lượng
                </option>

                <option value="ram">
                  RAM
                </option>
              </select>
            </div>

            {/* Preview */}
            {form.name && (
              <div className="version-preview-card">

                <div
                  className={`version-preview-dot ${
                    form.type === "ram"
                      ? "version-preview-ram"
                      : "version-preview-storage"
                  }`}
                />

                <div>
                  <div className="version-preview-name">
                    {form.name}
                  </div>

                  <div className="version-preview-meta">
                    {form.slug} ·{" "}
                    {form.type === "ram"
                      ? "RAM"
                      : "Dung lượng"}
                  </div>
                </div>

              </div>
            )}

            <button
              type="submit"
              className="version-submit-btn"
            >
              <PlusIcon />

              {editId
                ? "Cập nhật phiên bản"
                : "Thêm phiên bản"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}