import { useState } from "react";
import AppleLogo from "../../assets/apple-logo.png";
import OppoLogo from "../../assets/oppo-logo.png";
import SamsungLogo from "../../assets/samsung-logo.png";
import XiaomiLogo from "../../assets/xiaomi-logo.png";
import VivoLogo from "../../assets/vivo-logo.png";
import OtherLogo from "../../assets/other-logo.png";

import Iphone16Promax from "../../assets/iphone-16-promax.png";
import SamsungS25Ultra from "../../assets/samsungs25-ultra.png";
import Xiaomi15Ultra from "../../assets/xiaomi-15-ultra.png";
import Iphone14Promax from "../../assets/iphone14-promax.png";
import Iphone17Promax from "../../assets/iphone17-promax.png";
import "./HomePage.css";

/* ── Static data ── */
const FEATURED_PHONES = [
  {
    id: 1,
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    price: 34990000,
    oldPrice: 38990000,
    tag: "Bán chạy",
    tagColor: "#007AFF",
    color: "#1a1a2e",
    accent: "#007AFF",
    specs: ["A18 Pro", "48MP ProRAW", "Titanium"],
    image: Iphone16Promax,
  },
  {
    id: 2,
    name: "Samsung S25 Ultra",
    brand: "Samsung",
    price: 31990000,
    oldPrice: null,
    tag: "Mới nhất",
    tagColor: "#00c878",
    color: "#0a1628",
    accent: "#00c878",
    specs: ["Snapdragon 8 Elite", "200MP", "S Pen"],
    image: SamsungS25Ultra,
  },
  {
    id: 3,
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    price: 22490000,
    oldPrice: 25990000,
    tag: "Giảm giá",
    tagColor: "#ff8c00",
    color: "#1a0a0a",
    accent: "#ff8c00",
    specs: ["Snapdragon 8 Elite", "Leica 50MP", "5000mAh"],
    image: Xiaomi15Ultra,
  },
  {
    id: 4,
    name: "Iphone 14 Promax",
    brand: "Apple",
    price: 27990000,
    oldPrice: null,
    tag: "Nổi bật",
    tagColor: "#855af1",
    color: "#0d0d1f",
    accent: "#855af1",
    specs: ["A16 Bionic", "Camera48MP", "Dynamic Island"],
    image: Iphone14Promax,
  },
];

const BRANDS = [
  { id: "apple",   label: "Apple",   image: AppleLogo, count: 24 },
  { id: "samsung", label: "Samsung", image: SamsungLogo, count: 31 },
  { id: "xiaomi",  label: "Xiaomi",  image: XiaomiLogo, count: 18 },
  { id: "oppo",    label: "OPPO",    image: OppoLogo, count: 15 },
  { id: "vivo",    label: "Vivo",    image: VivoLogo, count: 9  },
  { id: "other",   label: "Khác",    image: OtherLogo, count: 42 },
];

const STATS = [
  { value: "15K+", label: "Khách hàng" },
  { value: "500+", label: "Sản phẩm" },
  { value: "99%",  label: "Hài lòng" },
  { value: "24/7", label: "Hỗ trợ" },
];

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

/**
 * HomePage Component
 */
export default function HomePage({ onNavigate, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState(null);
  // Biến state này có thể giữ lại nếu bro muốn dùng logic nâng cao cho hoveredCard sau này
  const [, setHoveredCard] = useState(null);

  return (
    <div className="hp-root">

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-bg" />
        <div className="hp-hero-grid" />
        <div className="hp-hero-orb1" />
        <div className="hp-hero-orb2" />

        <div className="hp-hero-content">
          <div className="hp-hero-eyebrow">
            <span className="hp-eyebrow-dot" />
            Điện thoại chính hãng — Giao nhanh 2 giờ
          </div>

          <h1 className="hp-hero-title">
            Công nghệ
            <br />
            <span className="hp-title-gradient">đỉnh cao nhất</span>
          </h1>

          <p className="hp-hero-sub">
            Khám phá hàng trăm mẫu điện thoại cao cấp, chính hãng.
            Bảo hành 12 tháng · Đổi trả 30 ngày · Trả góp 0%.
          </p>

          <div className="hp-hero-cta">
            <button className="hp-btn-primary" onClick={() => onNavigate?.("product")}>
              Xem sản phẩm
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className="hp-btn-secondary" onClick={() => onNavigate?.("about")}>
              Về chúng tôi
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hp-scroll-hint">
          <div className="hp-scroll-bar" />
          Cuộn xuống
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="hp-stats">
        <div className="hp-stats-inner">
          {STATS.map((s) => (
            <div key={s.label} className="hp-stat-item">
              <div className="hp-stat-value">{s.value}</div>
              <div className="hp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BRANDS ── */}
      <section className="hp-section">
        <div className="hp-section-head">
          <div className="hp-section-label">Danh mục</div>
          <h2 className="hp-section-title">Tìm theo thương hiệu</h2>
          <p className="hp-section-sub">Hơn 139 sản phẩm từ các thương hiệu uy tín toàn cầu.</p>
        </div>
        <div className="hp-brand-grid">
          {BRANDS.map((brand) => (
            <div
              key={brand.id}
              className={`hp-brand-card ${activeCategory === brand.id ? "active" : ""}`}
              onClick={() => setActiveCategory(activeCategory === brand.id ? null : brand.id)}
            >
              <img className="hp-brand-image" src={brand.image} alt={brand.label} />
              <span className="hp-brand-name">{brand.label}</span>
              <span className="hp-brand-count">{brand.count} sản phẩm</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="hp-section" style={{ paddingTop: 0 }}>
        <div className="hp-section-head">
          <div className="hp-section-label">Nổi bật</div>
          <h2 className="hp-section-title">Sản phẩm hot nhất</h2>
          <p className="hp-section-sub">Được khách hàng tin tưởng và đánh giá cao nhất tháng này.</p>
        </div>

        <div className="hp-prod-grid">
          {FEATURED_PHONES.map((phone) => (
            <div
              key={phone.id}
              className="hp-prod-card"
              style={{ background: phone.color }}
              onMouseEnter={() => setHoveredCard(phone.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Thumbnail */}
              <div
                className="hp-prod-thumb"
                style={{ "--accent-color": phone.accent }}
              >
                <div className="hp-prod-thumb-glow" />
                <img className="hp-prod-image" src={phone.image} alt={phone.name} />
                 
                <div
                  className="hp-prod-tag"
                  style={{
                    "--tag-bg":     `${phone.tagColor}18`,
                    "--tag-color":  phone.tagColor,
                    "--tag-border": `${phone.tagColor}40`,
                  }}
                >
                  {phone.tag}
                </div>
              </div>

              {/* Body */}
              <div className="hp-prod-body">
                <div className="hp-prod-brand">{phone.brand}</div>
                <div className="hp-prod-name">{phone.name}</div>
                <div className="hp-prod-specs">
                  {phone.specs.map((s) => (
                    <span key={s} className="hp-prod-spec">{s}</span>
                  ))}
                </div>
                <div className="hp-prod-price-row">
                  <div>
                    <div className="hp-prod-price">{fmt(phone.price)}</div>
                    {phone.oldPrice && (
                      <div className="hp-prod-old-price">{fmt(phone.oldPrice)}</div>
                    )}
                  </div>
                  <button
                    className="hp-prod-cart-btn"
                    onClick={() => onAddToCart?.(phone)}
                    aria-label={`Thêm ${phone.name} vào giỏ`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <div className="hp-banner">
        <div className="hp-banner-inner">
          <div className="hp-banner-text">
            <div className="hp-banner-eyebrow">⚡ Ưu đãi đặc biệt</div>
            <h2 className="hp-banner-title">Trả góp 0%<br />lên đến 24 tháng</h2>
            <p className="hp-banner-desc">
              Sở hữu ngay điện thoại mơ ước không lo về tài chính.
              Duyệt nhanh trong 5 phút — không cần thế chấp.
            </p>
            <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="hp-btn-primary" onClick={() => onNavigate?.("product")}>
                Mua ngay
              </button>
              <button className="hp-btn-secondary" onClick={() => onNavigate?.("contact")}>
                Liên hệ tư vấn
              </button>
            </div>
          </div>
          <img className="hp-banner-image" src={Iphone17Promax} alt="Phone Banner" />
        </div>
      </div>

    </div>
  );
}