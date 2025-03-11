import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const notifyOrder = () => toast('Order successfully placed!');

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isDelivery, setIsDelivery] = useState(true);
  const userId = JSON.parse(localStorage.getItem('userId')) || 0;
  const navigate = useNavigate();

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress') || 'No address saved';
    const savedInstructions = localStorage.getItem('deliveryInstructions') || 'No delivery instructions';
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    
    setAddress(savedAddress);
    setDeliveryInstructions(savedInstructions);
    setCartItems(savedCart);
  }, []);

  // Function to handle address editing
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    localStorage.setItem('address', e.target.value);
  };

  // Function to handle delivery instructions editing
  const handleInstructionsChange = (e) => {
    setDeliveryInstructions(e.target.value);
    localStorage.setItem('deliveryInstructions', e.target.value);
  };

  // Function to toggle between Delivery and Pickup
  const toggleDeliveryType = () => {
    setIsDelivery(!isDelivery);
  };

   // Calculate the tax
   const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal*0.2).toFixed(2);
  };  

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.price.slice(1)), 0).toFixed(2);
  };

  // Calculate total
  const calculateTotal = () => {
    const total = parseFloat (calculateSubtotal()) + parseFloat (calculateTax());
    return total.toFixed(2);
  };

  // Handle placing an order (you can send this to the backend here)
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast("Cart is empty. Please add items before placing an order.");
      return;
    }


    const order = {
      restaurantId: cartItems[0].restaurantId,
      restaurantProfileId: cartItems[0].restaurantId,
      customerId:userId,
      orderStatus: 'Order Received',
      items: cartItems,
      address,
      deliveryInstructions,
      isDelivery      
    };

     try {
    const response = await axios.post('http://localhost:2000/api/orders/saveOrder', order);
    
    if (response.status === 201) {
      notifyOrder();
      console.log('Order Placed Successfully:', response.data);
      
        
      // Redirect to OrderConfirmation and pass order details as state
      navigate('/OrderConfirmation', { state: { orderDetail: response.data } });

      // Clear the cart in localStorage
      // localStorage.removeItem('cart');

        
        // // Redirect user to the login page after a short delay
        // setTimeout(() => {
        //   window.location.reload();
        //   // Redirect to order confirmation page (if needed)
        //   window.location.replace('/order-confirmation');
          
        // }, 1000);      
     
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert("Failed to place order. Please try again.");
  }
};

  

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-6">
          <h3>Delivery / Pickup Information</h3>
          
          {/* Delivery / Pickup Toggle */}
          <div className="mb-3">
            <label>Choose Delivery Type:</label>
            <input
              type="checkbox"
              checked={isDelivery}
              onChange={toggleDeliveryType}
            />
            <span>{isDelivery ? 'Delivery' : 'Pickup'}</span>
          </div>

          {/* Address Section */}
          <div className="mb-3">
            <label>Address:</label>
            <div>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={handleAddressChange}
              />
              <button
                className="btn btn-link"
                onClick={() => setAddress('')} // Clear the address to edit inline
              >
                Edit
              </button>
            </div>
          </div>

          {/* Delivery Instructions Section */}
          <div className="mb-3">
            <label>Delivery Instructions:</label>
            <textarea
              className="form-control"
              rows="3"
              value={deliveryInstructions}
              onChange={handleInstructionsChange}
            ></textarea>
            <button
              className="btn btn-link"
              onClick={() => setDeliveryInstructions('')} // Clear the instructions to edit inline
            >
              Edit
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-6">
          <h3>Order Summary</h3>
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.quantity * parseFloat(item.price.slice(1))).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Subtotal */}
          <div className="mt-3">
            <strong>Tax: </strong>${calculateTax()}
          </div>

          {/* Subtotal */}
          <div className="mt-3">
            <strong>Subtotal: </strong>${calculateSubtotal()}
          </div>

          {/* Total */}
          <div className="mt-3">
            <strong>Total:</strong> ${calculateTotal()}
          </div>

          <div className="mt-3">
            <button className="btn btn-primary w-100" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
