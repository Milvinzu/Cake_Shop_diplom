import SpecialCake from '../models/SpecialCakeModel.js';

export const createSpecialCake = async (req, res) => {
    try {
        const { description, price, userId } = req.body;

        if (!description || !userId) {
            return res.status(400).json({ message: 'Description and userId are required.' });
        }

        const sentSpecialCakesCount = await SpecialCake.countDocuments({ userId, status: 'sent' });
        if (sentSpecialCakesCount >= 5) {
            return res.status(400).json({ message: 'You already have 5 special cakes with status "sent". You cannot create a new one.' });
        }

        const newSpecialCake = new SpecialCake({
            description,
            price,
            userId,
        });

        await newSpecialCake.save();

        res.status(201).json(newSpecialCake);
    } catch (error) {
        console.error('Error creating special cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSpecialCake = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSpecialCake = await SpecialCake.findByIdAndDelete(id);

        if (!deletedSpecialCake) {
            return res.status(404).json({ message: 'Special cake not found.' });
        }

        res.status(200).json(deletedSpecialCake);
    } catch (error) {
        console.error('Error deleting special cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSpecialCake = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, price, status } = req.body;

        if (status === 'received') {
            const specialCake = await SpecialCake.findById(id);
            if (specialCake && specialCake.status === 'received') {
                return res.status(400).json({ message: 'Cake order was already received.' });
            }
        }

        const updatedFields = { description, price, status };

        const updatedSpecialCake = await SpecialCake.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedSpecialCake) {
            return res.status(404).json({ message: 'Special cake not found.' });
        }

        res.status(200).json(updatedSpecialCake);
    } catch (error) {
        console.error('Error updating special cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllSpecialCakes = async (req, res) => {
    try {
        const specialCakes = await SpecialCake.find();

        res.status(200).json(specialCakes);
    } catch (error) {
        console.error('Error retrieving special cakes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSpecialCakeById = async (req, res) => {
    try {
        const { id } = req.params;

        const specialCake = await SpecialCake.findById(id);

        if (!specialCake) {
            return res.status(404).json({ message: 'Special cake not found.' });
        }

        res.status(200).json(specialCake);
    } catch (error) {
        console.error('Error retrieving special cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSpecialCakesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const specialCakes = await SpecialCake.find({ userId });

        if (!specialCakes || specialCakes.length === 0) {
            return res.status(404).json({ message: 'No special cakes found for this user.' });
        }

        res.status(200).json(specialCakes);
    } catch (error) {
        console.error('Error retrieving special cakes by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSpecialCakeStatus = async (cakeId) => {
    try {
        const updatedSpecialCake = await SpecialCake.findOneAndUpdate(
            { _id: cakeId },
            { status: 'paid' },
            { new: true }
        );
        return updatedSpecialCake;
    } catch (error) {
        console.error('Error updating special cake:', error);
        throw error;
    }
};