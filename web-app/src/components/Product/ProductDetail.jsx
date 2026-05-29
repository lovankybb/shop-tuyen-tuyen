import { useState } from "react";
import "./ProductDetail.css"; // Đã chuyển style ra file riêng cho clean code

const sampleImages = [
  "https://placehold.co/200x320/0a1a3e/00b4ff?text=Front",
  "https://placehold.co/200x320/0a1a3e/0066ff?text=Side",
  "https://placehold.co/200x320/0a1a3e/00b4ff?text=Back",
  "https://placehold.co/200x320/0a1a3e/0044cc?text=Detail",
];

export default function ProductDetail({
  brand = "Samsung",
  name = "Galaxy S25 Ultra",
  description = 'Điện thoại cao cấp nhất của Samsung với bộ vi xử lý Snapdragon 8 Elite, camera 200MP tích hợp AI, màn hình Dynamic AMOLED 6.9" 120Hz, pin 5000mAh sạc nhanh 45W và thiết kế khung Titanium sang trọng.',
  price = "31.990.000",
  oldPrice = "34.990.000",
  discount = "-9%",
  rating = 4.9,
  reviewCount = 2840,
  tags = ["Mới nhất", "HOT"],
  versions = ["256GB", "512GB", "1TB"],
  sizes = ['6.2"', '6.7"', '6.9"'],
  colors = [
    { label: "Titanium Black", hex: "#1a1a2e" },
    { label: "Titanium Silver", hex: "#8899aa" },
    { label: "Titanium Blue", hex: "#1a4a8a" },
    { label: "Phantom White", hex: "#dde8f5" },
  ],
  specs = [
    { label: "Chip", value: "Snapdragon 8 Elite" },
    { label: "RAM", value: "12GB LPDDR5X" },
    { label: "Camera", value: "200MP AI Quad" },
    { label: "Pin", value: "5000mAh 45W" },
    { label: "Màn hình", value: '6.9" 120Hz AMOLED' },
    { label: "OS", value: "Android 15 / One UI 7" },
  ],
  images = sampleImages,
  onAddToCart,
  onBuyNow,
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [toast, setToast] = useState(false);

  const switchImage = (index) => {
    if (index === currentImg) return;
    setSwitching(true);
    setTimeout(() => {
      setCurrentImg(index);
      setSwitching(false);
    }, 280);
  };

  const prevImg = () => switchImage((currentImg - 1 + images.length) % images.length);
  const nextImg = () => switchImage((currentImg + 1) % images.length);

  const handleAddToCart = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
    onAddToCart?.({ name, selectedVersion, selectedColor: colors[selectedColor].label, price });
  };

  const tagClass = (t) => {
    if (t === "Mới nhất" || t === "New") return "pd-tag pd-tag-new";
    if (t === "HOT" || t === "Hot") return "pd-tag pd-tag-hot";
    return "pd-tag pd-tag-sale";
  };

  return (
    <div className="pd-root">
      <div className="pd-container">

        {/* LEFT: Gallery */}
        <div className="pd-gallery">
          <div className="pd-main-image-wrap">
            <div className="pd-glow" />
            <button className="pd-nav-btn pd-nav-prev" onClick={prevImg}>‹</button>
            <img
              src={images[currentImg]}
              alt={name}
              className={`pd-main-img ${switching ? "switching" : ""}`}
            />
            <button className="pd-nav-btn pd-nav-next" onClick={nextImg}>›</button>
            <span className="pd-img-counter">{currentImg + 1} / {images.length}</span>
          </div>

          <div className="pd-thumbnails">
            {images.map((img, i) => (
              <div
                key={i}
                className={`pd-thumb ${i === currentImg ? "active" : ""}`}
                onClick={() => switchImage(i)}
              >
                <img src={img} alt={`${name} ảnh ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="pd-info">
          <div className="pd-tag-row">
            {tags.map((t, i) => <span key={i} className={tagClass(t)}>{t}</span>)}
          </div>

          <div className="pd-brand">{brand}</div>
          <h1 className="pd-name">{name}</h1>

          <div className="pd-rating">
            <span className="pd-stars">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
            <span className="pd-rating-num">{rating}</span>
            <span className="pd-rating-count">({reviewCount.toLocaleString()} đánh giá)</span>
          </div>

          <div className="pd-price-row">
            <div className="pd-price"><span className="cur">₫</span>{price}</div>
            {oldPrice && <span className="pd-old-price">₫{oldPrice}</span>}
            {discount && <span className="pd-discount">{discount}</span>}
          </div>

          <div className="pd-divider" />

          <div className="pd-options">
            {/* Version */}
            <div className="pd-option-group">
              <div className="pd-section-label">Phiên bản</div>
              <div className="pd-chips">
                {versions.map((v) => (
                  <button key={v} className={`pd-chip ${selectedVersion === v ? "selected" : ""}`} onClick={() => setSelectedVersion(v)}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="pd-option-group">
              <div className="pd-section-label">Kích thước màn hình</div>
              <div className="pd-chips">
                {sizes.map((s) => (
                  <button key={s} className={`pd-chip ${selectedSize === s ? "selected" : ""}`} onClick={() => setSelectedSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="pd-option-group">
              <div className="pd-section-label">Màu sắc — {colors[selectedColor].label}</div>
              <div className="pd-chips" style={{ alignItems: "center" }}>
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className={`pd-color-chip ${selectedColor === i ? "selected" : ""}`}
                    style={{ background: c.hex }}
                    title={c.label}
                    onClick={() => setSelectedColor(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pd-divider" />

          <div className="pd-section-label" style={{ marginBottom: "10px" }}>Mô tả sản phẩm</div>
          <p className="pd-desc">{description}</p>

          <div className="pd-section-label" style={{ marginBottom: "12px" }}>Thông số kỹ thuật</div>
          <div className="pd-specs">
            {specs.map((s, i) => (
              <div key={i} className="pd-spec">
                <div className="pd-spec-label">{s.label}</div>
                <div className="pd-spec-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="pd-cta">
            <button className="pd-btn pd-btn-cart" onClick={handleAddToCart}>🛒 Thêm giỏ hàng</button>
            <button className="pd-btn pd-btn-buy" onClick={onBuyNow}>⚡ Mua ngay</button>
          </div>
        </div>
      </div>

      <div className={`pd-toast ${toast ? "show" : ""}`}>✓ Đã thêm vào giỏ hàng!</div>
    </div>
  );
}