import "./Cart.css";

export default function Cart({
  items,
  setItems,
  onCheckout,
  onContinueShopping,
  setCartCount,
}) {
  const fmt = (n) => n.toLocaleString("vi-VN") + "₫";

  const updateQty = (id, qty) => {
    const newItems = items.map((it) =>
      it.id === id ? { ...it, qty: Math.max(1, it.qty + qty) } : it,
    );
    setItems(newItems);
  };

  const increaseQty = (id) => {
    updateQty(id, 1);
    setCartCount((prev) => prev + 1);
  };

  const decreaseQty = (id) => {
    updateQty(id, -1);
    setCartCount((prev) => prev - 1);
  };

  const removeItem = (id) => {
    const newItems = items.filter((it) => it.id !== id);
    setItems(newItems);
    setCartCount((prev) => prev - items.find((it) => it.id === id)?.qty || 0);
  };

  const clearCart = () => {
    setItems([]);
    setCartCount(0);  
  };

  const total = items.reduce((sum, it) => sum + parseInt(it.price.replace(/\./g, "")) * it.qty, 0); 

  return (
    <div className="cart-root">
      <div className="cart-bg-grid" />

      <div className="cart-wrap">
        <div className="cart-page-header">
          <div>
            <div className="cart-eyebrow">Mua sắm</div>
            <h1 className="cart-page-title">
              Giỏ hàng <span>({items.length})</span>
            </h1>
          </div>
          {items.length > 0 && (
            <button className="cart-clear-btn" onClick={clearCart}>
              🗑 Xóa tất cả
            </button>
          )}
        </div>

        {!items || items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <div className="cart-empty-title">Giỏ hàng trống</div>
            <p className="cart-empty-sub">
              Hãy khám phá và thêm những sản phẩm yêu thích vào giỏ nhé!
            </p>
            <button className="shop-now-btn" onClick={onContinueShopping}>
              Khám phá ngay →
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items Column */}
            <div className="cart-items-col">
              <div className="cart-items-header">
                <span className="col-head">Sản phẩm</span>
                <span className="col-head">Đơn giá</span>
                <span className="col-head center">Số lượng</span>
                <span className="col-head right">Thành tiền</span>
                <span />
              </div>

              {items.map((it) => (
                <div key={it.id} className={`cart-item`}>
                  <div className="item-info">
                    <div className="item-img-box">
                      <img src={it.image} alt={it.name} />
                    </div>
                    <div>
                      <div className="item-brand">{it.brand}</div>
                      <div className="item-name">{it.name}</div>
                    </div>
                  </div>

                  <div className="item-price">{fmt(it.price)}</div>

                  <div className="qty-stepper">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQty(it.id)}
                    >
                      −
                    </button>
                    <span className="qty-val">{it.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQty(it.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="item-remove"
                    onClick={() => removeItem(it.id)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Column */}
            <div className="cart-summary-col">
              <div className="summary-card">
                <div className="summary-title">TÓM TẮT ĐƠN HÀNG</div>

                <div className="summary-total-row">
                  <span className="summary-total-label">Tổng cộng</span>
                  <span className="summary-total-val">
                    <span className="cur">₫</span>
                    {total.toLocaleString("vi-VN")}
                  </span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => onCheckout?.({ items, total })}
                >
                  ⚡ Tiến hành thanh toán
                </button>
                <button className="continue-btn" onClick={onContinueShopping}>
                  ← Tiếp tục mua sắm
                </button>

                <div className="secure-badges">
                  <span className="secure-badge">🔒 Bảo mật SSL</span>
                  <span className="secure-badge">✓ Thanh toán an toàn</span>
                  <span className="secure-badge">🛡 Chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
