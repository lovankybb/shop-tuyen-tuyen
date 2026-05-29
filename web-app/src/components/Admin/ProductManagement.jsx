import { useState } from "react";
import "./ProductManagement.css"; // Import file css đã tách

const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 16 Pro Max 256GB",
    brand: "Apple",
    category: "Flagship",
    price: 34990000,
    salePrice: null,
    stock: 24,
    status: "active",
    slug: "IPH16PM-256",
    img: "📱",
  },
  {
    id: 2,
    name: "Samsung S25 Ultra 512GB",
    brand: "Samsung",
    category: "Flagship",
    price: 31990000,
    salePrice: null,
    stock: 17,
    status: "active",
    slug: "SS25U-512",
    img: "💎",
  },
  {
    id: 3,
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    category: "Flagship",
    price: 25990000,
    salePrice: 22490000,
    stock: 8,
    status: "active",
    slug: "MI15U-256",
    img: "⚡",
  },
  {
    id: 4,
    name: "Google Pixel 9 Pro",
    brand: "Google",
    category: "Flagship",
    price: 27990000,
    salePrice: null,
    stock: 5,
    status: "active",
    slug: "GPX9P-128",
    img: "🤖",
  },
  {
    id: 5,
    name: "OPPO Find X8",
    brand: "OPPO",
    category: "Tầm trung",
    price: 18990000,
    salePrice: 16990000,
    stock: 30,
    status: "active",
    slug: "OFX8-256",
    img: "🌸",
  },
  {
    id: 6,
    name: "Xiaomi Redmi Note 14",
    brand: "Xiaomi",
    category: "Giá rẻ",
    price: 6490000,
    salePrice: 5990000,
    stock: 50,
    status: "active",
    slug: "RN14-128",
    img: "📲",
  },
  {
    id: 7,
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    category: "Tầm trung",
    price: 10990000,
    salePrice: null,
    stock: 0,
    status: "draft",
    slug: "SGA55-256",
    img: "🔵",
  },
  {
    id: 8,
    name: "iPhone 15 128GB",
    brand: "Apple",
    category: "Tầm trung",
    price: 22490000,
    salePrice: 19990000,
    stock: 12,
    status: "archived",
    slug: "iphone-15",
    img: "📱",
  },
];

const STATUS = {
  active: { label: "Đang bán", color: "#16a34a" },
  draft: { label: "Bản nháp", color: "#d97706" },
  archived: { label: "Lưu trữ", color: "#6b7280" },
};

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

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

const ProductItem = (
  {p,
  toggleSelect,
  selected,
  isLow,
  changeStatus,
  handleDelete,}
) => {
  return (
    <tr className="pm-tr">
      <td className="pm-td">
        <input
          type="checkbox"
          className="pm-cb"
          checked={selected.includes(p.id)}
          onChange={() => toggleSelect(p.id)}
        />
      </td>
      <td className="pm-td">
        <div className="pm-product-info">
          <img className="pm-img" src={p.img} />
          <div>
            <div className="pm-product-name">{p.name}</div>
            <div className="pm-product-brand">{p.brand}</div>
          </div>
        </div>
      </td>
      <td className="pm-td">
        <span className="pm-category-text">{p.category}</span>
      </td>
      <td className="pm-td">
        <span className="pm-slug-text">{p.slug}</span>
      </td>
      <td className="pm-td">
        <div className="pm-price-main">{fmt(p.price)}</div>
        {p.salePrice && <div className="pm-price-sale">{fmt(p.salePrice)}</div>}
      </td>
      <td className="pm-td">
        <span
          className="pm-stock-status"
          style={{
            color: p.stock === 0 ? "#dc2626" : isLow ? "#d97706" : "#111",
          }}
        >
          {p.stock === 0 ? "Hết hàng" : `${p.stock} sp`}
        </span>
        {isLow && <div className="pm-stock-low-alert">Sắp hết</div>}
      </td>
      <td className="pm-td">
        <select
          className="pm-select-sm"
          value={p.status}
          onChange={(e) => changeStatus(p.id, e.target.value)}
        >
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </td>
      <td className="pm-td">
        <div className="pm-action-group">
          <button className="pm-btn-icon" title="Sửa">
            <EditIcon />
          </button>
          <button
            className="pm-btn-icon pm-btn-icon-red"
            title="Xoá"
            onClick={() => handleDelete(p.id)}
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function ProductManagement({ onCreateProduct }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [selected, setSelected] = useState([]);

  const brands = [...new Set(PRODUCTS.map((p) => p.brand))];

  const filtered = products.filter((p) => {
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchBrand = filterBrand === "all" || p.brand === filterBrand;
    return matchSearch && matchStatus && matchBrand;
  });

  const toggleSelect = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((p) => p.id),
    );

  const handleDelete = (id) => {
    if (!window.confirm("Xoá sản phẩm này?")) return;
    setProducts((p) => p.filter((x) => x.id !== id));
    setSelected((p) => p.filter((x) => x !== id));
  };

  const handleDeleteSelected = () => {
    if (!window.confirm(`Xoá ${selected.length} sản phẩm đã chọn?`)) return;
    setProducts((p) => p.filter((x) => !selected.includes(x.id)));
    setSelected([]);
  };

  const changeStatus = (id, status) =>
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <div className="pm-page">
      {/* Header */}
      <div className="pm-page-head">
        <div>
          <h1 className="pm-page-title">Quản lý sản phẩm</h1>
          <p className="pm-page-desc">
            {products.length} sản phẩm trong hệ thống
          </p>
        </div>
        <button className="pm-btn-primary" onClick={onCreateProduct}>
          + Thêm sản phẩm
        </button>
      </div>

      {/* Summary cards */}
      <div className="pm-summary-row">
        {[
          { label: "Tổng sản phẩm", value: products.length, color: "#2563eb" },
          {
            label: "Đang bán",
            value: products.filter((p) => p.status === "active").length,
            color: "#16a34a",
          },
          {
            label: "Hết hàng",
            value: products.filter((p) => p.stock === 0).length,
            color: "#dc2626",
          },
          {
            label: "Bản nháp",
            value: products.filter((p) => p.status === "draft").length,
            color: "#d97706",
          },
        ].map((st) => (
          <div key={st.label} className="pm-summary-card">
            <div style={{ fontSize: "24px", fontWeight: 700, color: st.color }}>
              {st.value}
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}>
              {st.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="pm-filter-bar">
        <input
          className="pm-search"
          placeholder="Tìm tên, SKU sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="pm-filter-group">
          <select
            className="pm-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <select
            className="pm-select"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk action */}
      {selected.length > 0 && (
        <div className="pm-bulk-bar">
          <span className="pm-bulk-text">
            Đã chọn {selected.length} sản phẩm
          </span>
          <button className="pm-btn-danger" onClick={handleDeleteSelected}>
            Xoá đã chọn
          </button>
        </div>
      )}

      {/* Table */}
      <div className="pm-card">
        <table className="pm-table">
          <thead>
            <tr>
              <th className="pm-th">
                <input
                  type="checkbox"
                  className="pm-cb"
                  checked={
                    filtered.length > 0 && selected.length === filtered.length
                  }
                  onChange={toggleAll}
                />
              </th>
              {[
                "Sản phẩm",
                "Danh mục",
                "Slug",
                "Giá",
                "Tồn kho",
                "Trạng thái",
                "",
              ].map((h) => (
                <th key={h} className="pm-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="pm-td"
                  style={{
                    textAlign: "center",
                    color: "#aaa",
                    padding: "40px",
                  }}
                >
                  Không có sản phẩm
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const isLow = p.stock > 0 && p.stock <= 5;
              return (
                <ProductItem
                  key={p.id}
                  p={p}
                  toggleSelect={toggleSelect}
                  selected={selected}
                  isLow={isLow}
                  changeStatus={changeStatus}
                  handleDelete={handleDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
