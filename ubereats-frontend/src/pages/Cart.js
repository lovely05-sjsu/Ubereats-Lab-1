import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
    updateSubtotal(cartData);
  }, []);

  const updateSubtotal = (cartData) => {
    let total = 0;
    cartData.forEach((item) => {
      total += item.quantity * parseFloat(item.price.replace("$", ""));
    });
    setSubtotal(total);
  };

  const handleIncrement = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateSubtotal(updatedCart);
  };

  const handleDecrement = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateSubtotal(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Order</h2>
      <div className="row">
        {cart.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={process.env.PUBLIC_URL + "/" + item.image}
                alt={item.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p><strong>Price:</strong> {item.price}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <button className="btn btn-secondary" onClick={() => handleIncrement(item.id)}>+</button>
                <button className="btn btn-secondary" onClick={() => handleDecrement(item.id)}>-</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
        <button className="btn btn-success" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
