import { useState, useEffect } from "react";
import Product from "./Product";
import ProductDetail from "./ProductDetail";
import SuccessPopup from "../Popup/SuccessPopup";
import { getAllProducts } from "../../service/ProductService";
import "./Shop.css";

const FILTERS = ["Tất cả", "Samsung", "Apple", "Xiaomi", "Google", "OPPO", "Vivo", "Realme", "OnePlus"];



export default function Shop({handleAddToCart}) {
  const [PRODUCTS, setPRODUCTS] = useState([]);

  useEffect(() => {
    getAllProducts().then(data => {
       // Convert backend data to Shop format
       const formatted = data.map(p => ({
         id: p.id,
         brand: p.brand || "Unknown",
         name: p.name,
         description: p.description,
         price: (p.price || 0).toLocaleString("vi-VN"),
         oldPrice: p.salePrice ? (p.salePrice || 0).toLocaleString("vi-VN") : null,
         rating: 5.0,
         reviewCount: 0,
         category: p.category || "Unknown",
         image: p.images && p.images.length > 0 ? p.images[0] : "https://placehold.co/130x200/0a1a3e/00b4ff?text=No+Image",
         images: p.images && p.images.length > 0 ? p.images : ["https://placehold.co/200x320/0a1a3e/00b4ff?text=No+Image"],
         versions: ["Mặc định"],
         colors: [{ label: "Mặc định", hex: "#1a1a2e" }]
       }));
       setPRODUCTS(formatted);
    }).catch(console.error);
  }, []);

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