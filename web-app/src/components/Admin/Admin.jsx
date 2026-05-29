import { useState } from "react";
import "./Admin.css";

import Brand from "./Brand";
import Category from "./Category";
import CreateProduct from "./CreateProduct";
import CustomerManagement from "./CustomerManagement";
import Dashboard from "./Dashboard";
import OrderManagement from "./OrderManagement";
import ProductManagement from "./ProductManagement";
import Color from "./Color";
import Version from "./Version";
/* ── Icons ── */
const ICONS = {
  dashboard: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),

  products: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),

  create: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),

  manage: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-square-chart-gantt-icon lucide-square-chart-gantt"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 8h7" />
      <path d="M8 12h6" />
      <path d="M11 16h5" />
    </svg>
  ),

  customer: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-book-user-icon lucide-book-user"
    >
      <path d="M15 13a3 3 0 1 0-6 0" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  ),
  box: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-cuboid-icon lucide-cuboid"
    >
      <path d="M10 22v-8" />
      <path d="M2.336 8.89 10 14l11.715-7.029" />
      <path d="M22 14a2 2 0 0 1-.971 1.715l-10 6a2 2 0 0 1-2.138-.05l-6-4A2 2 0 0 1 2 16v-6a2 2 0 0 1 .971-1.715l10-6a2 2 0 0 1 2.138.05l6 4A2 2 0 0 1 22 8z" />
    </svg>
  ),
  color: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-paintbrush-vertical-icon lucide-paintbrush-vertical"
    >
      <path d="M10 2v2" />
      <path d="M14 2v4" />
      <path d="M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" />
      <path d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1" />
    </svg>
  ),
  brand: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-dice1-icon lucide-dice-1"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M12 12h.01" />
    </svg>
  ),
  version: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-gallery-horizontal-end-icon lucide-gallery-horizontal-end"
    >
      <path d="M2 7v10" />
      <path d="M6 5v14" />
      <rect width="12" height="18" x="10" y="3" rx="2" />
    </svg>
  ),
  category: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-tag-icon lucide-tag"
    >
      <path d="M20.59 13.41 12 21.99a2 2 0 0 1-2.83 0L2.34 15.42a2 2 0 0 1 0-2.83l8.59-8.59a2 2 0 0 1 2.83 0l5.42 5.42a2 2 0 0 1 0 2.83z" />
      <path d="M7.07 7.07a2 2 0 1 1-2.83-2.83 2 2 0 0 1 2.83 2.83z" />
    </svg>
  ),
};

const NAV_GROUPS = [
  {
    label: "Tổng quan",
    items: [{ id: "dashboard", label: "Dashboard", icon: "dashboard" }],
  },
  {
    label: "Sản phẩm",
    items: [
      { id: "products", label: "Danh sách SP", icon: "products" },
      { id: "create", label: "Thêm sản phẩm", icon: "create" },
      { id: "categories", label: "Thêm danh mục", icon: "category" },
      { id: "brand", label: "Thêm thương hiệu", icon: "brand" },
      { id: "color", label: "Thêm màu sắc", icon: "color" },
      { id: "version", label: "Thêm phiên bản", icon: "version" },
    ],
  },
  {
    label: "Khách hàng",
    items: [{ id: "customers", label: "Quản lý khách hàng", icon: "customer" }],
  },
  {
    label: "Đơn hàng",
    items: [{ id: "orders", label: "Quản lý đơn hàng", icon: "box" }],
  },
];

export default function Admin() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;

      case "products":
        return <ProductManagement onCreateProduct={() => setPage("create")} />;

      case "create":
        return (
          <CreateProduct
            onSuccess={() => setPage("products")}
          />
        );

      case "orders":
        return <OrderManagement />;

      case "customers":
        return <CustomerManagement />;

      case "brand":
        return <Brand />;

      case "category":
        return <Category />;
      case "color":
        return <Color />;

      case "version":
        return <Version />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-root">
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">N</div>

          {!collapsed && (
            <div>
              <div className="brand-name">NEXUS</div>
              <div className="brand-sub">Admin Panel</div>
            </div>
          )}

          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="nav">
          {NAV_GROUPS.map((group) => (
            <div className="nav-group" key={group.label}>
              {!collapsed && (
                <div className="nav-group-label">{group.label}</div>
              )}

              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`nav-item ${
                    page === item.id ? "nav-item-active" : ""
                  }`}
                >
                  <span>{ICONS[item.icon]}</span>

                  {!collapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <div className="breadcrumb">
            NEXUS Admin /{" "}
            {
              NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === page)
                ?.label
            }
          </div>

          <div className="topbar-avatar">A</div>
        </header>

        <main className="content">{renderPage()}</main>
      </div>
    </div>
  );
}
