import { useState } from "react";
import "./Account.css";

const ORDERS = [
  {
    id: "TN-250523-001",
    date: "23/05/2025",
    status: "shipping",
    products: [
      {
        brand: "Samsung",
        name: "Galaxy S25 Ultra",
        variant: "512GB • Titanium Black",
        price: 31990000,
        qty: 1,
        img: "https://placehold.co/36x52/0a1a3e/00b4ff?text=S25",
      },
    ],
    total: 32490000,
  },
];

const STATUS_MAP = {
  delivered: { label: "Đã giao", cls: "delivered" },
  shipping: { label: "Đang giao", cls: "shipping" },
  pending: { label: "Chờ xử lý", cls: "pending" },
  cancelled: { label: "Đã hủy", cls: "cancelled" },
};

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];

const DEFAULT_PROFILE = {
  name: "Nguyễn Minh Khoa",
  email: "minhkhoa@gmail.com",
  phone: "0901 234 567",
  gender: "Nam",
  dob: "15/08/1998",
  city: "TP. Hồ Chí Minh",
  address: "123 Nguyễn Huệ, Quận 1",
};

export default function Account({
  user = {
    name: "Nguyễn Minh Khoa",
    email: "minhkhoa@gmail.com",
    emoji: "😎",
    level: "NOVA GOLD",
    orders: 4,
  },
}) {
  const [tab, setTab] = useState("orders");
  const [filter, setFilter] = useState("all");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  const filtered =
    filter === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.status === filter);

  const fmt = (n) => n.toLocaleString("vi-VN");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="acc-root">
      <div className="acc-bg-grid" />
      <div className="acc-bg-orb" />

      <div className="acc-inner">

        {/* BANNER */}
        <div className="acc-banner">
          <div className="acc-banner-glow" />

          <div className="acc-avatar">
            {user.emoji}
            <div className="acc-avatar-dot" />
          </div>

          <div className="acc-banner-info">
            <div className="acc-banner-name">{user.name}</div>

            <div className="acc-banner-email">{user.email}</div>

            <div className="acc-banner-badges">
              <span className="acc-badge badge-level">
                {user.level}
              </span>

              <span className="acc-badge badge-stat">
                📦 {user.orders} đơn hàng
              </span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="acc-tabs">
          <button
            className={`acc-tab ${tab === "orders" ? "active" : ""}`}
            onClick={() => setTab("orders")}
          >
            📦 Sản phẩm đã mua
          </button>

          <button
            className={`acc-tab ${tab === "profile" ? "active" : ""}`}
            onClick={() => setTab("profile")}
          >
            👤 Thông tin cá nhân
          </button>
        </div>

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="acc-panel">

            <div className="acc-panel-head">
              <div className="acc-panel-title">
                📦 Lịch sử mua hàng
              </div>
            </div>

            <div className="acc-panel-body">

              <div className="order-filter-row">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className={`o-chip ${
                      filter === f.key ? "active" : ""
                    }`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filtered.map((order) => (
                <div className="order-card" key={order.id}>

                  <div className="order-card-head">
                    <div className="order-meta">
                      <span className="order-id">
                        #{order.id}
                      </span>

                      <div className="order-sep" />

                      <span className="order-date">
                        {order.date}
                      </span>
                    </div>

                    <span
                      className={`o-status ${
                        STATUS_MAP[order.status].cls
                      }`}
                    >
                      {STATUS_MAP[order.status].label}
                    </span>
                  </div>

                  <div className="order-card-products">
                    {order.products.map((p, i) => (
                      <div className="order-prod-row" key={i}>

                        <div className="op-img-box">
                          <img
                            src={p.img}
                            alt={p.name}
                            className="op-img"
                          />
                        </div>

                        <div className="op-details">
                          <div className="op-brand">
                            {p.brand}
                          </div>

                          <div className="op-name">
                            {p.name}
                          </div>

                          <div className="op-variant">
                            {p.variant}
                          </div>
                        </div>

                        <div className="op-qty-price">
                          <div className="op-price">
                            ₫{fmt(p.price)}
                          </div>

                          <div className="op-qty">
                            x{p.qty}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  <div className="order-card-foot">

                    <div>
                      <div className="order-total-label">
                        Tổng thanh toán
                      </div>

                      <div className="order-total-val">
                        ₫{fmt(order.total)}
                      </div>
                    </div>

                    <div className="order-foot-btns">

                      <button className="o-btn o-btn-primary">
                        📍 Theo dõi
                      </button>

                      <button className="o-btn o-btn-ghost">
                        Chi tiết
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="acc-panel">

            <div className="acc-panel-head">
              <div className="acc-panel-title">
                👤 Thông tin cá nhân
              </div>
            </div>

            <div className="acc-panel-body">

              <div className="pf-grid">

                <div className="pf-group full">
                  <label className="pf-label">
                    Họ và tên
                  </label>

                  <input
                    className="pf-input"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pf-group">
                  <label className="pf-label">Email</label>

                  <input
                    className="pf-input"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pf-group">
                  <label className="pf-label">
                    Số điện thoại
                  </label>

                  <input
                    className="pf-input"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

              </div>

              <div className="pf-actions">

                <button
                  className="pf-save"
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>

                <button
                  className="pf-reset"
                  onClick={() =>
                    setProfile(DEFAULT_PROFILE)
                  }
                >
                  Đặt lại
                </button>

                <div
                  className={`pf-toast ${
                    saved ? "show" : ""
                  }`}
                >
                  ✓ Đã lưu thành công!
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}