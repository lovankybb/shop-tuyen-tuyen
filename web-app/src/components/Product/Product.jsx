import { useState } from "react";
import "./Product.css"; // Nhập style từ file CSS ngoài gọn gàng

const defaultImage = "https://placehold.co/130x180/0a1a3e/00b4ff?text=Phone";

export default function Product({
  id = 1,
  badge = "Mới nhất",
  brand = "Samsung",
  name = "Galaxy S25 Ultra",
  description = "Snapdragon 8 Elite, Camera 200MP AI, Pin 5000mAh, Titanium Design",
  price = "31.990.000",
  oldPrice = "34.990.000",
  image = defaultImage,
  category = "Điện thoại",
  onAddToCart,
  onBuyNow,
}) {
  const [toastVisible, setToastVisible] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
    onAddToCart?.({ id, name, price, image, qty: 1 });
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    onBuyNow?.({ id, name, price, image, qty: 1 });
  };


  return (
    <div className="product-card">
      {badge && <div className="product-badge">{badge}</div>}

      <div className={`added-toast ${toastVisible ? "show" : ""}`}>✓ Đã thêm vào giỏ</div>

      <div className="product-image-wrapper">
        <div className="glow-ring" />
        <img src={image} alt={name} className="product-img" />
      </div>

      <div className="product-info">
        <div className="product-brand">{brand}</div>
        <h3 className="product-name">{name}</h3>
        <p className="product-desc">{description}</p>

        <div className="product-footer">
          <div>
            <span className="product-price">
              <span>₫</span>{price}
            </span>
            {oldPrice && <span className="product-old-price">₫{oldPrice}</span>}
          </div>
        </div>

        <div className="product-actions">
          <button className="btn btn-cart" onClick={handleAddToCart}>🛒 Giỏ hàng</button>
          <button className="btn btn-buy" onClick={handleBuyNow}>Mua ngay</button>
        </div>
      </div>
    </div>
  );
}