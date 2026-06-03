import { useEffect, useState } from "react";
import "./Version.css";
import {
  createVersion,
  getVersions,
  updateVersion,
  deleteVersion,
} from "../../service/VersionService";

import ConfirmPopup from "../Popup/ConfirmPopup";
import SuccessPopup from "../Popup/SuccessPopup";
import ErrorPopup from "../Popup/ErrorPopup";

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
  const [versions, setVersions] = useState([]);
  const [versionName, setVersionName] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await getVersions();
        setVersions(data);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };

    fetchVersions();
  }, []);

  const validate = () => {
    const err = {};

    if (!versionName.trim()) {
      err.name = "Vui lòng nhập tên phiên bản";
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
      const updatedVersion = {
        id: editId,
        name: versionName,
      };

      updateVersion(editId, updatedVersion)
        .then(() => {
          setVersions((prev) =>
            prev.map((v) => (v.id === editId ? updatedVersion : v)),
          );
          setEditId(null);
          setSuccessMessage("Phiên bản đã được cập nhật thành công.");
          setSuccessOpen(true);
        })
        .catch((error) => {
          setErrorMessage(
            "Đã có lỗi xảy ra khi cập nhật phiên bản. Vui lòng thử lại.",
          );
          setErrorOpen(true);
          console.error("Error updating version:", error);
        });

      setEditId(null);
    } else {
      createVersion({ name: versionName })
        .then((newVersion) => {
          setVersions((prev) => [...prev, newVersion]);
          setVersionName("");
          setSuccessMessage("Phiên bản đã được tạo thành công.");
          setSuccessOpen(true);
        })
        .catch((error) => {
          setErrorMessage(
            "Đã có lỗi xảy ra khi tạo phiên bản. Vui lòng thử lại.",
          );
          setErrorOpen(true);
          console.error("Error creating version:", error);
        });
    }

    setErrors({});
  };

  const handleEdit = (version) => {
    setEditId(version.id);

    setVersionName(version.name);
    setErrors({});
  };

  const handleCancel = () => {
    setEditId(null);
    setVersionName("");
    setErrors({});
  };

  const handleDelete = (id) => {
    deleteVersion(id)
      .then(() => {
        setVersions((prev) => prev.filter((v) => v.id !== id));
        setSuccessMessage("Phiên bản đã được xóa thành công.");
        setSuccessOpen(true);
      })
      .catch((error) => {
        console.error("Error deleting version:", error);
        setErrorMessage(
          "Đã có lỗi xảy ra khi xóa phiên bản. Vui lòng thử lại.",
        );
        setErrorOpen(true);
      });
  };

  const filtered = versions.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {" "}
      <div className="version-page">
        {/* Header */}
        <div className="version-page-head">
          <div>
            <h1 className="version-page-title">Phiên bản</h1>

            <p className="version-page-desc">
              Quản lý dung lượng và RAM sản phẩm
            </p>
          </div>

          <div className="version-badge">{versions.length} phiên bản</div>
        </div>

        <div className="version-wrap">
          {/* TABLE */}
          <div className="version-card">
            <div className="version-card-head">
              <span className="version-card-title">Danh sách phiên bản</span>

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
                  <th className="version-th"></th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="version-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}

                {filtered.map((v) => (
                  <tr key={v.id} className="version-tr">
                    <td className="version-td">
                      <span className="version-name">{v.name}</span>
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
                        onClick={() => {
                          setConfirmOpen(true);
                          setDeleteId(v.id);
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
          <div className="version-card">
            <div className="version-card-head">
              <span className="version-card-title">
                {editId ? "Sửa phiên bản" : "Thêm phiên bản"}
              </span>

              {editId && (
                <button className="version-cancel-btn" onClick={handleCancel}>
                  Huỷ
                </button>
              )}
            </div>

            <form className="version-form" onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div>
                <label className="version-label">Tên phiên bản *</label>

                <input
                  className={`version-input ${
                    errors.name ? "version-input-error" : ""
                  }`}
                  placeholder="VD: 256 GB"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                />

                {errors.name && (
                  <span className="version-error">{errors.name}</span>
                )}
              </div>

              {/* Preview */}
              {versionName && (
                <div className="version-preview-card">
                  <div>
                    <div className="version-preview-name">{versionName}</div>
                  </div>
                </div>
              )}

              <button type="submit" className="version-submit-btn">
                <PlusIcon />

                {editId ? "Cập nhật phiên bản" : "Thêm phiên bản"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ConfirmPopup
        isOpen={confirmOpen}
        title="Xác nhận xóa phiên bản"
        message="Bạn có chắc chắn muốn xóa phiên bản này không? Hành động này không thể hoàn tác."
        confirmInput={null}
        onConfirm={() => {
          handleDelete(deleteId);
          setSuccessOpen(true);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
      <SuccessPopup
        isOpen={successOpen}
        title="Thành công"
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorPopup
        isOpen={errorOpen}
        title="Lỗi"
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </>
  );
}
