import { useEffect, useState } from "react";
import "./Category.css";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../service/CategoryService";
import ConfirmPopup from "../Popup/ConfirmPopup";
import SuccessPopup from "../Popup/SuccessPopup";
import ErrorPopup from "../Popup/ErrorPopup";



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

export default function Category() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setErrorMsg("Không thể tải danh mục từ server");
        setErrorOpen(true);
      }
    };

    fetchCategories();
  }, []);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Vui lòng nhập tên danh mục";
    }

    return e;
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: value,
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
      setCategories((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...form } : c)),
      );

      updateCategory(editId, form)
        .then(() => {
          setSuccessMsg("Cập nhật danh mục thành công");
          setSuccessOpen(true);
        })
        .catch(() => {
          setErrorMsg("Cập nhật danh mục thất bại");
          setErrorOpen(true);
        });

      setEditId(null);
    } else {
      createCategory(form)
        .then((newCategory) => {
          setCategories((prev) => [...prev, newCategory]);
          setSuccessMsg("Thêm danh mục thành công");
          setSuccessOpen(true);
        })
        .catch(() => {
          setErrorMsg("Thêm danh mục thất bại");
          setErrorOpen(true);
        });
    }

    setForm({
      name: "",
      description: "",
    });
  };

  const handleEdit = (category) => {
    setEditId(category.id);

    setForm({
      name: category.name,
      description: category.description,
    });
  };

  const handleDelete = (id) => {
    deleteCategory(id)
      .then(() => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setSuccessMsg("Xoá danh mục thành công");
        setSuccessOpen(true);
      })
      .catch(() => {
        setErrorMsg("Xoá danh mục thất bại");
        setErrorOpen(true);
      });
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="category-page">
        <div className="category-page-head">
          <div>
            <h1 className="category-page-title">Danh mục</h1>

            <p className="category-page-desc">Quản lý danh mục sản phẩm</p>
          </div>

          <div className="category-badge">{categories.length} danh mục</div>
        </div>

        <div className="category-wrap">
          {/* TABLE */}
          <div className="category-card">
            <div className="category-card-head">
              <span className="category-card-title">Danh sách</span>

              <input
                className="category-search"
                placeholder="Tìm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <table className="category-table">
              <thead>
                <tr>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="category-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}

                {filtered.map((c) => (
                  <tr key={c.id} className="category-row">
                    <td className="category-td">
                      <span className="category-name">{c.name}</span>
                    </td>

                    <td className="category-td">
                      <code className="category-slug">{c.slug}</code>
                    </td>

                    <td className="category-td">
                      <span className="category-desc">
                        {c.description || "—"}
                      </span>
                    </td>

                    <td className="category-action-cell">
                      <button
                        className="category-icon-btn"
                        onClick={() => handleEdit(c)}
                      >
                        <EditIcon />
                      </button>

                      <button
                        className="category-icon-btn category-icon-btn-red"
                        onClick={() => {
                          setConfirmOpen(true);
                          setDeleteId(c.id);
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
          <div className="category-card">
            <div className="category-card-head">
              <span className="category-card-title">
                {editId ? "Sửa danh mục" : "Thêm danh mục"}
              </span>

              {editId && (
                <button
                  className="category-cancel-btn"
                  onClick={() => {
                    setEditId(null);

                    setForm({
                      name: "",
                      slug: "",
                      description: "",
                    });

                    setErrors({});
                  }}
                >
                  Huỷ
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <Field label="Tên danh mục *" error={errors.name}>
                <input
                  className={`category-input ${
                    errors.name ? "category-input-error" : ""
                  }`}
                  placeholder="VD: Điện thoại flagship"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </Field>

              <Field label="Mô tả">
                <textarea
                  className="category-input category-textarea"
                  placeholder="Mô tả ngắn về danh mục..."
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </Field>

              <button type="submit" className="category-submit-btn">
                <PlusIcon />

                {editId ? "Cập nhật" : "Thêm danh mục"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ConfirmPopup
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          handleDelete(deleteId);
          setConfirmOpen(false);
          setSuccessMsg("Xoá danh mục thành công");
          setSuccessOpen(true);
        }}
        title="Xoá danh mục"
        message="Bạn có chắc muốn xoá danh mục này?"
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
    <div className="category-field">
      <label className="category-label">{label}</label>

      {children}

      {error && <span className="category-error-msg">{error}</span>}
    </div>
  );
}
