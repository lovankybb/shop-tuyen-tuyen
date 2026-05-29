import { useState } from "react";
import "./CustomerManagement.css";

const CUSTOMERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@gmail.com",
    phone: "0912 345 678",
    orders: 5,
    totalSpent: 87490000,
    joined: "12/01/2026",
    status: "active",
    city: "TP.HCM",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@gmail.com",
    phone: "0987 654 321",
    orders: 3,
    totalSpent: 63980000,
    joined: "08/02/2026",
    status: "active",
    city: "Hà Nội",
  },
  {
    id: 3,
    name: "Lê Minh C",
    email: "minhc@yahoo.com",
    phone: "0901 111 222",
    orders: 1,
    totalSpent: 22490000,
    joined: "20/03/2026",
    status: "active",
    city: "Đà Nẵng",
  },
  {
    id: 4,
    name: "Phạm Thu D",
    email: "thud@hotmail.com",
    phone: "0933 222 111",
    orders: 8,
    totalSpent: 134520000,
    joined: "05/11/2025",
    status: "active",
    city: "Hải Phòng",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "vane@gmail.com",
    phone: "0966 777 888",
    orders: 2,
    totalSpent: 69980000,
    joined: "14/04/2026",
    status: "blocked",
    city: "Huế",
  },
];

const avatarColors = [
  "#2563eb",
  "#7c3aed",
  "#16a34a",
  "#d97706",
  "#dc2626",
];

const fmt = (n) =>
  n === 0
    ? "0₫"
    : new Intl.NumberFormat("vi-VN").format(n) + "₫";

const avatar = (name) =>
  name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Customer() {
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);

    const matchStatus =
      filterStatus === "all" || c.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const toggleBlock = (id) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status:
                c.status === "blocked"
                  ? "active"
                  : "blocked",
            }
          : c
      )
    );
  };

  const getRank = (spent) => {
    if (spent >= 100000000) {
      return {
        label: "VIP",
        color: "#d97706",
        bg: "#fffbeb",
      };
    }

    if (spent >= 50000000) {
      return {
        label: "Gold",
        color: "#7c3aed",
        bg: "#f5f3ff",
      };
    }

    if (spent >= 20000000) {
      return {
        label: "Silver",
        color: "#6b7280",
        bg: "#f9fafb",
      };
    }

    return {
      label: "New",
      color: "#2563eb",
      bg: "#eff6ff",
    };
  };

  return (
    <>
      <div className="customer-page">
        <div className="customer-header">
          <div>
            <h1 className="customer-title">Khách hàng</h1>
            <p className="customer-desc">
              {customers.length} khách hàng đã đăng ký
            </p>
          </div>

          <div className="customer-stat-row">
            <div className="customer-stat-chip">
              <span className="customer-stat-value">
                {customers.length}
              </span>
              <span className="customer-stat-label">
                Tổng KH
              </span>
            </div>
          </div>
        </div>

        <div className="customer-filter-bar">
          <div className="customer-filter-left">
            <input
              className="customer-search"
              placeholder="Tìm tên, email, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="customer-select"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị khoá</option>
            </select>
          </div>
        </div>

        <div className="customer-card">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Liên hệ</th>
                <th>Đơn hàng</th>
                <th>Tổng chi tiêu</th>
                <th>Hạng</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => {
                const rank = getRank(c.totalSpent);

                return (
                  <tr key={c.id} className="customer-row">
                    <td>
                      <div className="customer-user">
                        <div
                          className="customer-avatar"
                          style={{
                            background:
                              avatarColors[
                                c.id %
                                  avatarColors.length
                              ],
                          }}
                        >
                          {avatar(c.name)}
                        </div>

                        <div>
                          <div className="customer-name">
                            {c.name}
                          </div>

                          <div className="customer-city">
                            {c.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="customer-contact">
                        {c.email}
                      </div>

                      <div className="customer-phone">
                        {c.phone}
                      </div>
                    </td>

                    <td>{c.orders} đơn</td>

                    <td className="customer-spent">
                      {fmt(c.totalSpent)}
                    </td>

                    <td>
                      <span
                        className="customer-rank"
                        style={{
                          background: rank.bg,
                          color: rank.color,
                        }}
                      >
                        {rank.label}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`customer-status ${
                          c.status === "active"
                            ? "customer-status-active"
                            : "customer-status-blocked"
                        }`}
                      >
                        {c.status === "active"
                          ? "Hoạt động"
                          : "Bị khoá"}
                      </span>
                    </td>

                    <td>
                      <div className="customer-actions">
                        <button
                          className="customer-btn"
                          onClick={() => setDetail(c)}
                        >
                          Xem
                        </button>

                        <button
                          className={`customer-btn ${
                            c.status === "blocked"
                              ? "customer-btn-green"
                              : "customer-btn-red"
                          }`}
                          onClick={() =>
                            toggleBlock(c.id)
                          }
                        >
                          {c.status === "blocked"
                            ? "Mở"
                            : "Khoá"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div
          className="customer-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDetail(null);
            }
          }}
        >
          <div className="customer-modal">
            <div className="customer-modal-header">
              <h3>{detail.name}</h3>

              <button
                className="customer-close-btn"
                onClick={() => setDetail(null)}
              >
                ✕
              </button>
            </div>

            <div className="customer-modal-body">
              <div>Email: {detail.email}</div>
              <div>SĐT: {detail.phone}</div>
              <div>
                Tổng chi tiêu:{" "}
                {fmt(detail.totalSpent)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}