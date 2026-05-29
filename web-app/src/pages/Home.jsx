import HomePage from "../components/HomePage/HomePage";
import Header from "../components/Header/Header";
import Shop from "../components/Product/Shop";
import { useState } from "react";
import About from "../components/About/About";
import Account from "../components/Account/Account";
import Cart from "../components/Product/Cart";

const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartList, setCartList] = useState([]);
  const [onNavigate, setOnNavigate] = useState("home");

  const [isUserVisible, setIsUserVisible] = useState(false);
  const [iscartVisible, setIsCartVisible] = useState(false);

  const onUserClick = () => {
    onNavigate ? setOnNavigate(null) : setOnNavigate("home");
    setIsUserVisible(!isUserVisible);
    setIsCartVisible(false);
  };

  const onCartClick = () => {
    onNavigate ? setOnNavigate(null) : setOnNavigate("home");
    setIsCartVisible(!iscartVisible);
    setIsUserVisible(false);
  };

  const handleAddToCart = (info) => {
    console.log("Thêm vào giỏ hàng: ", info);
    setCartCount((prev) => prev + 1);
    if(!cartList.some((item) => item.id === info.id)) {
      setCartList((prev) => [...prev, info]);
    } else {
      setCartList((prev) =>
        prev.map((item) =>
          item.id === info.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    }
  };


  const onContinueShopping = () => {
    setOnNavigate("shop");
    setIsCartVisible(false);
  }

  return (
    <div>
      <Header
        activePage={onNavigate}
        cartCount={cartCount}
        onNavigate={setOnNavigate}
        onUserClick={onUserClick}
        onCartClick={onCartClick}
      />
      {onNavigate === "home" && <HomePage />}
      {onNavigate === "shop" && <Shop handleAddToCart={handleAddToCart} />}
      {onNavigate === "about" && <About />}
      {isUserVisible && <Account />}
      {iscartVisible && (
        <Cart
          items={cartList}
          setItems={setCartList}
          onCheckout={() => alert("Checkout")}
          onContinueShopping={onContinueShopping}
          setCartCount={setCartCount}
        />
      )}
    </div>
  );
};

export default Home;
