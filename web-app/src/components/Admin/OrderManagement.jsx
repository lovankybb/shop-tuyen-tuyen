import { useState } from "react";
import "./OrderManagement.css";

const ORDERS = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    phone: "0912 345 678",
    product: "iPhone 16 Pro Max",
    qty: 1,
    total: 34990000,
    status: "pending",
    date: "27/05/2026",
    address: "12 Lê Lợi, Q1, TP.HCM",
  },
];

const STATUS_MAP = {
  pending: {
    label: "Chờ xác nhận",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },

  confirmed: {
    label: "Đã xác nhận",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },

  shipping: {
    label: "Đang giao",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },

  delivered: {
    label: "Đã giao",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },

  cancelled: {
    label: "Đã huỷ",
    color: "#dc2626",
    bg: "#fff5f5",
    border: "#fecaca",
  },
};

const STATUS_FLOW = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
];

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN").format(n) + "₫";

export default function OrderManagement() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchStatus =
      filter === "all" || o.status === filter;

    const matchSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const updateStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );
  };

  return (
    <div className="order-page">

      {/* HEADER */}
      <div className="order-head">
        <div>
          <h1 className="order-title">
            Quản lý đơn hàng
          </h1>

          <p className="order-desc">
            Theo dõi và xử lý đơn hàng
          </p>
        </div>

        <div className="stat-row">
          <div className="stat-chip">
            <span className="stat-value">
              {orders.length}
            </span>

            <span className="stat-label">
              Tổng đơn
            </span>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-bar">

        <div className="tabs">
          {[
            { key: "all", label: "Tất cả" },

            ...Object.entries(STATUS_MAP).map(
              ([k, v]) => ({
                key: k,
                label: v.label,
              })
            ),
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`tab ${
                filter === t.key ? "active" : ""
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          className="search"
          placeholder="Tìm đơn hàng..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* TABLE */}
      <div className="table-card">

        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => {
              const st = STATUS_MAP[o.status];

              return (
                <tr key={o.id}>
                  <td>
                    <code className="order-code">
                      {o.id}
                    </code>
                  </td>

                  <td>
                    <div className="customer-name">
                      {o.customer}
                    </div>

                    <div className="customer-phone">
                      {o.phone}
                    </div>
                  </td>

                  <td>
                    <div>{o.product}</div>
                    <small>x{o.qty}</small>
                  </td>

                  <td className="order-total">
                    {fmt(o.total)}
                  </td>

                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: st.bg,
                        color: st.color,
                        borderColor: st.border,
                      }}
                    >
                      {st.label}
                    </span>
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(
                          o.id,
                          e.target.value
                        )
                      }
                    >
                      {STATUS_FLOW.map((st) => (
                        <option
                          key={st}
                          value={st}
                        >
                          {STATUS_MAP[st].label}
                        </option>
                      ))}

                      <option value="cancelled">
                        Huỷ đơn
                      </option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
}