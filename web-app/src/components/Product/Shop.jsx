import { useState } from "react";
import Product from "./Product";
import ProductDetail from "./ProductDetail";
import SuccessPopup from "../Popup/SuccessPopup"

import "./Shop.css"; // Nhúng file style riêng biệt vừa tách vào đây

const PRODUCTS = [
  {
    id: 1,
    badge: "Mới nhất",
    brand: "Samsung",
    name: "Galaxy S25 Ultra",
    description: "Snapdragon 8 Elite, Camera 200MP AI, Pin 5000mAh, Titanium",
    price: "31.990.000",
    oldPrice: "34.990.000",
    rating: 4.9,
    reviewCount: 2840,
    category: "Samsung",
    image: "https://placehold.co/130x200/0a1a3e/00b4ff?text=S25+Ultra",
    images: [
      "https://placehold.co/200x320/0a1a3e/00b4ff?text=S25+Front",
      "https://placehold.co/200x320/0a1a3e/0066ff?text=S25+Side",
      "https://placehold.co/200x320/0a1a3e/00b4ff?text=S25+Back",
      "https://placehold.co/200x320/0a1a3e/0044cc?text=S25+Camera",
    ],
    versions: ["256GB", "512GB", "1TB"],
    colors: [
      { label: "Titanium Black", hex: "#1a1a2e" },
      { label: "Titanium Silver", hex: "#8899aa" },
      { label: "Titanium Blue", hex: "#1a4a8a" },
    ],
  },
  {
    id: 2,
    badge: "HOT",
    brand: "Apple",
    name: "iPhone 16 Pro Max",
    description: "A18 Pro, Camera 48MP Fusion, Action Button, ProMotion 120Hz",
    price: "34.990.000",
    oldPrice: "36.990.000",
    rating: 4.8,
    reviewCount: 3210,
    category: "Apple",
    image: "https://placehold.co/130x200/0a1a3e/60aaff?text=iPhone+16",
    images: [
      "https://placehold.co/200x320/0a1a3e/60aaff?text=iPhone+Front",
      "https://placehold.co/200x320/0a1a3e/3388ff?text=iPhone+Side",
      "https://placehold.co/200x320/0a1a3e/60aaff?text=iPhone+Back",
      "https://placehold.co/200x320/0a1a3e/2266cc?text=iPhone+Cam",
    ],
    versions: ["256GB", "512GB", "1TB"],
    colors: [
      { label: "Natural Titanium", hex: "#b0a090" },
      { label: "Black Titanium", hex: "#2a2a3a" },
      { label: "Desert Titanium", hex: "#c8a870" },
    ],
  },
  {
    id: 3,
    badge: "Giảm giá",
    brand: "Xiaomi",
    name: "Xiaomi 15 Ultra",
    description: "Snapdragon 8 Gen 4, Leica Camera 50MP, Pin 6000mAh, Sạc 90W",
    price: "22.990.000",
    oldPrice: "26.990.000",
    rating: 4.7,
    reviewCount: 985,
    category: "Xiaomi",
    image: "https://placehold.co/130x200/0a1a3e/00ddff?text=Xiaomi+15",
    images: [
      "https://placehold.co/200x320/0a1a3e/00ddff?text=Mi+Front",
      "https://placehold.co/200x320/0a1a3e/00aacc?text=Mi+Side",
      "https://placehold.co/200x320/0a1a3e/00ddff?text=Mi+Back",
      "https://placehold.co/200x320/0a1a3e/0088aa?text=Mi+Lens",
    ],
    versions: ["256GB", "512GB"],
    colors: [
      { label: "Matte Black", hex: "#151520" },
      { label: "Glacier White", hex: "#ddeeff" },
      { label: "Ceramic Blue", hex: "#1a3a6a" },
    ],
  },
  {
    id: 4,
    badge: "Mới",
    brand: "Google",
    name: "Pixel 9 Pro XL",
    description: "Google Tensor G4, AI Photography, 7 năm cập nhật, Màn hình LTPO",
    price: "28.490.000",
    oldPrice: "30.990.000",
    rating: 4.6,
    reviewCount: 720,
    category: "Google",
    image: "https://placehold.co/130x200/0a1a3e/4488ff?text=Pixel+9",
    images: [
      "https://placehold.co/200x320/0a1a3e/4488ff?text=Pixel+Front",
      "https://placehold.co/200x320/0a1a3e/2266dd?text=Pixel+Side",
      "https://placehold.co/200x320/0a1a3e/4488ff?text=Pixel+Back",
      "https://placehold.co/200x320/0a1a3e/1155bb?text=Pixel+AI",
    ],
    versions: ["128GB", "256GB", "512GB"],
    colors: [
      { label: "Obsidian", hex: "#1a1a1a" },
      { label: "Porcelain", hex: "#e8e0d5" },
      { label: "Hazel", hex: "#7a8a6a" },
    ],
  },
  {
    id: 5,
    badge: "Bestseller",
    brand: "OPPO",
    name: "OPPO Find X8 Pro",
    description: "Dimensity 9400, Hasselblad Camera, Sạc 100W SUPERVOOC, MariSilicon X2",
    price: "26.990.000",
    oldPrice: "28.990.000",
    rating: 4.7,
    reviewCount: 1105,
    category: "OPPO",
    image: "https://placehold.co/130x200/0a1a3e/0099cc?text=Find+X8",
    images: [
      "https://placehold.co/200x320/0a1a3e/0099cc?text=Find+Front",
      "https://placehold.co/200x320/0a1a3e/0077aa?text=Find+Side",
      "https://placehold.co/200x320/0a1a3e/0099cc?text=Find+Back",
      "https://placehold.co/200x320/0a1a3e/005588?text=Hasselblad",
    ],
    versions: ["256GB", "512GB"],
    colors: [
      { label: "Space Black", hex: "#0a0a18" },
      { label: "Pearl White", hex: "#f0eae0" },
    ],
  },
  {
    id: 6,
    badge: null,
    brand: "OnePlus",
    name: "OnePlus 13",
    description: "Snapdragon 8 Gen 4, Hasselblad 50MP, Sạc 100W, Pin 6000mAh khổng lồ",
    price: "19.990.000",
    oldPrice: "22.490.000",
    rating: 4.5,
    reviewCount: 843,
    category: "OnePlus",
    image: "https://placehold.co/130x200/0a1a3e/3366ff?text=OnePlus+13",
    images: [
      "https://placehold.co/200x320/0a1a3e/3366ff?text=OP+Front",
      "https://placehold.co/200x320/0a1a3e/1144dd?text=OP+Side",
      "https://placehold.co/200x320/0a1a3e/3366ff?text=OP+Back",
      "https://placehold.co/200x320/0a1a3e/0033bb?text=OP+Cam",
    ],
    versions: ["256GB", "512GB"],
    colors: [
      { label: "Midnight Ocean", hex: "#0a1a3a" },
      { label: "Arctic Dawn", hex: "#c8d8e8" },
    ],
  },
];

const FILTERS = ["Tất cả", "Samsung", "Apple", "Xiaomi", "Google", "OPPO", "Vivo", "Realme", "OnePlus"];



export default function Shop({handleAddToCart}) {
  const [filter, setFilter] = useState("Tất cả");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isSuccessPOpupVisible, setIsSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const filtered = filter === "Tất cả"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === filter);

  // ĐÃ KHẮC PHỤC: Định nghĩa hàm này để tránh trang bị lỗi khi truyền prop vào Product/ProductDetail


  const handleBuyNow = (info) => {
    console.log("Mua ngay:", info);
    setSuccessMessage(`Đang xử lý mua ngay: ${info?.name || selectedProduct?.name}`);
    setIsSuccessPopupVisible(true);
  };

  return (
    <>
    <div className="shop-root">
      {/* Hero */}
      <section className="shop-hero">
        <div className="hero-bg-grid" />
        <div className="hero-bg-glow" />
        <h1 className="hero-title">
          Smartphone<br /><span>Đỉnh Cao</span> 2025
        </h1>
        <p className="hero-sub">
          Khám phá bộ sưu tập điện thoại cao cấp mới nhất từ các thương hiệu hàng đầu thế giới
        </p>
      </section>

      {/* Filters */}
      <div className="shop-filter">
        <span className="filter-label">Lọc</span>
        {FILTERS.map((f) => (
          <button 
            key={f} 
            className={`filter-chip ${filter === f ? "active" : ""}`} 
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <div className="filter-divider" />
        <button className="filter-chip" style={{ borderColor: "rgba(255,200,0,0.3)", color: "rgba(255,200,0,0.6)" }}>
          ★ Nổi bật
        </button>
      </div>

      {/* Grid */}
      <section className="shop-grid-section">
        <div className="shop-section-header">
          <span className="shop-section-title">SẢN PHẨM</span>
          <span className="shop-section-count">{filtered.length} sản phẩm</span>
        </div>

        <div className="shop-grid">
          {filtered.map((p) => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ cursor: "pointer" }}>
              <Product
                {...p}
                onAddToCart={(info) => handleAddToCart(info)}
                onBuyNow={(info) => handleBuyNow(info)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="footer-logo">TECH<span>NOVA</span></div>
        <div className="footer-note">© 2025 TechNova — Nơi công nghệ gặp gỡ phong cách</div>
      </footer>

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <div className="detail-overlay">
          <button className="detail-close" onClick={() => setSelectedProduct(null)}>✕</button>
          <ProductDetail
            brand={selectedProduct.brand}
            name={selectedProduct.name}
            description={`${selectedProduct.description}. Được trang bị những công nghệ tiên tiến nhất, đây là lựa chọn hoàn hảo cho người dùng hiện đại.`}
            price={selectedProduct.price}
            oldPrice={selectedProduct.oldPrice}
            discount={selectedProduct.oldPrice ? `-${Math.round((1 - parseInt(selectedProduct.price.replace(/\./g,'')) / parseInt(selectedProduct.oldPrice.replace(/\./g,''))) * 100)}%` : null}
            rating={selectedProduct.rating}
            reviewCount={selectedProduct.reviewCount}
            tags={[selectedProduct.badge].filter(Boolean)}
            images={selectedProduct.images}
            versions={selectedProduct.versions}
            colors={selectedProduct.colors}
            onAddToCart={(info) => { handleAddToCart(info); setSelectedProduct(null); }}
            onBuyNow={() => handleBuyNow({ name: selectedProduct.name })}
          />
        </div>
      )}
    </div>
    <SuccessPopup 
      visible={isSuccessPOpupVisible} 
      message={successMessage || "Đã thêm vào giỏ hàng!"} 
      onClose={() => setIsSuccessPopupVisible(false)} 
    />
    </>
  );
}