import { useState, useEffect } from "react";
import "./Header.css"; // Import file style vừa tách biệt ở đây

const NAV_LINKS = [
  { id: "home", label: "Trang chủ" },
  { id: "shop", label: "Sản phẩm" },
  { id: "about", label: "Về chúng tôi" },
];

/* ── SVG Icons Components ── */
const PhoneLogo = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const CartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Header({
  activePage = "home",
  onNavigate,
  onCartClick,
  onUserClick,
  cartCount = 0,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id) => {
    onNavigate?.(id);
    setMobileOpen(false);
  };

  return (
    <>
      <header className={`hdr-root${scrolled ? " scrolled" : ""}`}>
        <div className="hdr-shimmer" />
        <div className="hdr-inner">
          {/* Brand */}
          <div
            className="hdr-brand"
            onClick={() => handleNav("home")}
            role="button"
            tabIndex={0}
          >
            <div className="hdr-brand-icon">
              <PhoneLogo />
            </div>
            <div>
              <div className="hdr-brand-name">TUYẾN</div>
              <div className="hdr-brand-sub">Mobile Store</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav>
            <ul className="hdr-nav">
              {NAV_LINKS.map((link) => (
                <li key={link.id} className="hdr-nav-item">
                  <button
                    className={`hdr-nav-btn${activePage === link.id ? " active" : ""}`}
                    onClick={() => handleNav(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="hdr-actions">
            <button
              className="hdr-icon-btn"
              onClick={onCartClick}
              aria-label="Giỏ hàng"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="hdr-cart-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <button
              className="hdr-icon-btn"
              onClick={onUserClick}
              aria-label="Tài khoản"
            >
              <UserIcon />
            </button>
            <button
              className="hdr-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`hdr-drawer${mobileOpen ? " open" : ""}`}>
        <div
          className="hdr-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
        />
        <div className="hdr-drawer-panel">
          <div className="hdr-drawer-head">
            <div className="hdr-brand">
              <div className="hdr-brand-icon">
                <PhoneLogo />
              </div>
              <div>
                <div className="hdr-brand-name">NEXUS</div>
                <div className="hdr-brand-sub">Mobile Store</div>
              </div>
            </div>
            <button
              className="hdr-drawer-close"
              onClick={() => setMobileOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <ul className="hdr-drawer-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  className={`hdr-drawer-nav-btn${activePage === link.id ? " active" : ""}`}
                  onClick={() => handleNav(link.id)}
                >
                  <span className="dot" />
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hdr-drawer-footer">
            <button className="hdr-drawer-action-btn" onClick={onCartClick}>
              <CartIcon />
              <span>Giỏ hàng{cartCount > 0 ? ` (${cartCount})` : ""}</span>
            </button>
            <button className="hdr-drawer-action-btn" onClick={onUserClick}>
              <UserIcon />
              <span>Tài khoản</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
