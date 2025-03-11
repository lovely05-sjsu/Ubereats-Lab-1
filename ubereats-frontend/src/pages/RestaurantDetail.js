import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useCart } from "./context/CartContext";
import axios from 'axios';
import "../index.css";


const notifyAdd = () => toast('🛒 Added to order!');

const notifyClear = () => toast('🔥 All items cleared as new item is from a different restaurant!');

// Dummy data for now (replace with backend call)
// const getRestaurantById = (id) => {
//   const restaurants = [
//     {
//       id: 1,
//       name: "Pizza Guys",
//       rating: 4.5,
//       deliveryFee: "$2.99",
//       arrivalTime: 25,
//       address: "123 Main St, City, Country",
//       image: "images/pizzaguys/header.jpg",
//       menu: [
//         {
//           id: 1,
//           name: "Pepperoni Pizza",
//           price: "$9.99",
//           rating: 4.8,
//           description: "Delicious pepperoni pizza with mozzarella.",
//           image: "images/pizzaguys/pepperoni_pizza.jpeg",
//         },
//         {
//           id: 2,
//           name: "Cheese Pizza",
//           price: "$8.99",
//           rating: 4.7,
//           description: "Classic cheese pizza with extra cheese.",
//           image: "images/pizzaguys/cheese_pizza.jpeg",
//         },
//         {
//           id: 3,
//           name: "Hawaiian Delight",
//           price: "$8.99",
//           rating: 4.7,
//           description: "Hawaiian Delight",
//           image: "images/pizzaguys/hawaiian_delight.jpeg",
//         },
//       ],
//       reviews: [
//         {
//           user: "John Doe",
//           rating: 5,
//           comment: "Amazing pizza, would order again!",
//         },
//         {
//           user: "Jane Smith",
//           rating: 4,
//           comment: "Great pizza but delivery took a bit longer.",
//         },
//       ],
//     },
//   ];

//   return restaurants.find((rest) => rest.id === parseInt(id));
// };

const RestaurantDetail = () => {
  const { cart, updateCart } = useCart(); // Get the cart state and updateCart function
  const { id } = useParams(); // Get the restaurant ID from URL params
  const [restaurant, setRestaurant] = useState(null);    
  const [loading, setLoading] = useState(true);
  const [isDelivery, setIsDelivery] = useState(true); // Toggle for delivery/pickup
  
 
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/api/restaurants/getRestaurantDetails/${id}`); // Call API
        setRestaurant(response.data); // Store response in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [id]);

  if (loading) return <p>Loading restaurants...</p>;

  const handleAddToCart = (item) => {
    // Check if the cart already has items from a different restaurant
    if (cart.length > 0 && cart[0].restaurantId !== id ) {
      // If different restaurant, clear the cart and add new item
      notifyClear();
      updateCart([{ ...item, quantity: 1, restaurantId: id }]);
    } else {
      // Check if the item already exists in the cart
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
      if (existingItemIndex > -1) {
        // If item exists, update the quantity
        cart[existingItemIndex].quantity += 1;
      } else {
        // If item doesn't exist, add it to the cart
        cart.push({ ...item, quantity: 1, restaurantId: id });
      }
  
      // Update the cart in context and localStorage
      updateCart([...cart]);
    }
  
    notifyAdd();
  };
  

  if (!restaurant) return <div>Loading...</div>; // Display loading until restaurant data is fetched

  return (
    <div className="container mt-5">
  {/* Header Section */}
  <div className="header-section mb-4">
    <img
      src={process.env.PUBLIC_URL + "/" + restaurant.image}
      alt={restaurant.name}
      className="img-fluid"
    />
    <div className="info-section">
      <div>
        <h1 className="restaurant-name">{restaurant.name}</h1>
        <div>
           <strong>Rating:</strong> {restaurant.rating} <span role="img" aria-label="star">⭐</span>
        </div>
        <div>
          <strong>Address:</strong> {restaurant.address}
        </div>
      </div>

      {/* Delivery / Pickup Switch */}
      <div>
        <label htmlFor="deliverySwitch" className="mr-2">
          {isDelivery ? "Delivery" : "Pickup"}
        </label>
        <input
          type="checkbox"
          id="deliverySwitch"
          checked={isDelivery}
          onChange={() => setIsDelivery(!isDelivery)}
        />
      </div>
    </div>
  </div>

  {/* Info Section (Right side - Delivery fee and Arrival time) */}
  <div className="d-flex justify-content-between mb-4">
    <div className="info-section">
      <div>
        <strong>Delivery Fee:</strong> {restaurant.deliveryFee}
      </div>
      <div>
        <strong>Arrival Time:</strong> {restaurant.arrivalTime} mins
      </div>
    </div>
  </div>
  
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    transition={Bounce}
  />

  {/* Menu Section */}
  <h2>Menu</h2>
  <div className="row">
    {restaurant.menu.map((item, index) => (
      <div key={index} className="col-md-4 mb-4">
        <div className="card">
          <img
            src={process.env.PUBLIC_URL + "/" + item.image}
            alt={item.name}
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <p><strong>Price:</strong> {item.price}</p>
            <p><strong>Rating:</strong> {item.rating} ★</p>
            <p>{item.description}</p>
            <button className="fancy-btn" onClick={() => handleAddToCart(item)}>
              <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default RestaurantDetail;
