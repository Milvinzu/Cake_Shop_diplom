import OrderCake from '../models/OrderCakeModel.js';

export const createOrderCake = async (req, res) => {
    try {
        const { shablonCakeId, tasteId, number, weight, price, words } = req.body;
        const newOrderCake = new OrderCake({ shablonCakeId, tasteId, number, weight, price, words });
        const savedOrderCake = await newOrderCake.save();
        res.status(201).json(savedOrderCake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrderCakes = async (req, res) => {
    try {
        const orderCakes = await OrderCake.find();
        res.status(200).json(orderCakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderCakeById = async (req, res) => {
    try {
        const orderCake = await OrderCake.findById(req.params.id);
        if (!orderCake) {
            return res.status(404).json({ message: 'OrderCake not found' });
        }
        res.status(200).json(orderCake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderCakeById = async (req, res) => {
    try {
        const { shablonCakeId, tasteId, number, weight, price, words } = req.body;
        const updatedOrderCake = await OrderCake.findByIdAndUpdate(
            req.params.id,
            { shablonCakeId, tasteId, number, weight, price, words },
            { new: true }
        );
        if (!updatedOrderCake) {
            return res.status(404).json({ message: 'OrderCake not found' });
        }
        res.status(200).json(updatedOrderCake);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrderCakeById = async (req, res) => {
    try {
        const deletedOrderCake = await OrderCake.findByIdAndDelete(req.params.id);
        if (!deletedOrderCake) {
            return res.status(404).json({ message: 'OrderCake not found' });
        }
        res.status(200).json({ message: 'OrderCake deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
