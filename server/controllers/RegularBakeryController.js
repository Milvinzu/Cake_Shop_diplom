import RegularBakery from '../models/RegularBakeryModel.js';

export const createRegularBakery = async (req, res) => {
    try {
        console.log('Request to create bakery:', req.body);
        const { category, name, description, weight, price, img } = req.body;

        if (!category || !name || !description || !weight || !price) {
            return res.status(400).json({ message: 'Category, name, description, weight, and price are required.' });
        }

        const newRegularBakery = new RegularBakery({
            category,
            name,
            description,
            weight,
            price,
            img,
        });

        const savedBakery = await newRegularBakery.save();

        res.status(201).json(savedBakery);
    } catch (error) {
        console.error('Error creating regular bakery:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRegularBakery = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRegularBakery = await RegularBakery.findByIdAndDelete(id);

        if (!deletedRegularBakery) {
            return res.status(404).json({ message: 'Regular bakery not found.' });
        }

        res.status(200).json(deletedRegularBakery);
    } catch (error) {
        console.error('Error deleting Regular Bakery:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRegularBakery = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, name, description, weight, price, img } = req.body;

        const updatedRegularBakery = await RegularBakery.findByIdAndUpdate(
            id,
            { category, name, description, weight, price, img },
            { new: true, runValidators: true }
        );

        if (!updatedRegularBakery) {
            return res.status(404).json({ message: 'Bakery not found.' });
        }

        res.status(200).json(updatedRegularBakery);
    } catch (error) {
        console.error('Error updating regular bakery:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBakeryImg = async ([id, img], res) => {
    try {
        const updatedBakery = await RegularBakery.findByIdAndUpdate(
            id,
            { img },
            { new: true, runValidators: true }
        );

        if (!updatedBakery) {
            return res.status(404).json({ message: 'Bakery not found.' });
        }

        return updatedBakery;
    } catch (error) {
        console.error('Error updating bakery image:', error);
        throw error;
    }
};
export const getAllRegularBakery = async (req, res) => {
    try {
        const regularBakeries = await RegularBakery.find();

        res.status(200).json(regularBakeries);
    } catch (error) {
        console.error('Error retrieving regular bakeries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRegularBakeryById = async (req, res) => {
    try {
        const { id } = req.params;

        const regularBakery = await RegularBakery.findById(id);

        if (!regularBakery) {
            return res.status(404).json({ message: 'Bakery not found.' });
        }

        res.status(200).json(regularBakery);
    } catch (error) {
        console.error('Error retrieving bakery:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getRegularBakeryByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const regularBakeries = await RegularBakery.find({ category });

        if (!regularBakeries.length) {
            return res.status(404).json({ message: 'No bakeries found for this category.' });
        }

        res.status(200).json(regularBakeries);
    } catch (error) {
        console.error('Error retrieving bakeries by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
