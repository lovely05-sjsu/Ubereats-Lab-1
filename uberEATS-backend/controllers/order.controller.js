const { Order, OrderItem, sequelize  } = require('../models');

// 📌 Place a new order
const createOrder = async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
    }
};


const saveOrder = async (req, res) => {
    const t = await sequelize.transaction();  // Start a transaction

    try {
        const { address, isDelivery, customerId, restaurantId, restaurantProfileId, orderStatus, items } = req.body;
    
        console.log(address, isDelivery, customerId, restaurantId, restaurantProfileId, orderStatus, items);
        
        // Convert restaurantId and restaurantProfileId to integers
        const parsedRestaurantId = parseInt(restaurantId, 10);
        const parsedRestaurantProfileId = parseInt(restaurantProfileId, 10);

        if (isNaN(parsedRestaurantId) || isNaN(parsedRestaurantProfileId)) {
            return res.status(400).json({ error: "Invalid restaurantId or restaurantProfileId" });
        }

        // Create the order inside a transaction
        const newOrder = await Order.create({
            customerId,
            restaurantId: parsedRestaurantId,
            restaurantProfileId: parsedRestaurantProfileId,
            address,
            isDelivery,
            orderStatus,
        }, { transaction: t });

        // Create order items inside the same transaction
        const orderItems = items.map(item => ({
            orderId: newOrder.id,
            menuItemId: item.id,
            name: item.name,
            description: item.description,
            image: item.image,
            price: parseFloat(item.price),
            quantity: item.quantity,
        }));

        await OrderItem.bulkCreate(orderItems, { transaction: t });

        // Commit the transaction
        await t.commit();

        const orderDetails = {
            address,
            isDelivery,
            orderStatus,
            items
        };

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id, orderDetails:orderDetails });
    } catch (error) {
        // Rollback the transaction in case of an error
        await t.rollback();
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
};



  const getOrder = async (req, res) => {
    try {
      const { id } = req.params; // Order ID from request params
  
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,  // Updated to use OrderItem instead of OrderDetail
            as: "items",
          }
        ],
      });
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      // Formatting the response
      const formattedOrder = {
        customerId: order.customerId,
        restaurantId: order.restaurantId,
        restaurantProfileId: order.restaurantProfileId,
        address: order.address,
        isDelivery: order.isDelivery,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map(item => ({
          id: item.menuItemId,
          name: item.name,
          description: item.description,
          image: item.image,
          price: item.price.toFixed(2),
          quantity: item.quantity,
        })),
      };
  
      res.json(formattedOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  };


// 📌 Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// 📌 Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Error fetching order" });
    }
};

// 📌 Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.orderStatus = status;
        await order.save();
        res.status(200).json({ message: "Order status updated!", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};


// 📌 Update order status
const completeOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = 'Complete';
        await order.save();
        res.status(200).json({ message: "Order status updated!", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};


// 📌 Update order status
const cancelOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = 'Complete';
        await order.save();
        res.status(200).json({ message: "Order status updated!", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};


module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus,getOrder, saveOrder,completeOrderStatus,cancelOrderStatus};
