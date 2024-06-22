import Order from '../models/OrderModel.js';
import OrderCake from '../models/OrderCakeModel.js';

export const createOrder = async (req, res) => {
    try {
        const { orderCakesIds, bakeryIds, userId, totalPrice, description } = req.body;

        const newOrder = new Order({
            orderCakesIds: orderCakesIds || [],
            bakeryIds: bakeryIds || [],
            userId,
            totalPrice,
            description,
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderCakesIds, bakeryIds, status, totalPrice, description } = req.body;

        const updateData = {
            status,
            totalPrice,
            description,
        };

        if (orderCakesIds) {
            updateData.orderCakesIds = orderCakesIds;
        }

        if (bakeryIds) {
            updateData.bakeryIds = bakeryIds;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        await OrderCake.deleteMany({ _id: { $in: deletedOrder.orderCakesIds } });

        res.status(200).json(deletedOrder);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const findOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('orderCakesIds')
            .populate('bakeryIds')
            .populate('userId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error finding order by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const findAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('orderCakesIds')
            .populate('bakeryIds')
            .populate('userId');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const findOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId })
            .populate('orderCakesIds')
            .populate('bakeryIds')
            .populate('userId');

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error finding orders by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateOrderStatus = async (orderId) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId },
            { status: 'paid' },
            { new: true }
        );
        return updatedOrder;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};