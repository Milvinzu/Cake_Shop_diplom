import Taste from '../models/TasteModel.js';

export const createTaste = async (req, res) => {
    try {
        const { cakeId, name, description, img } = req.body;
        if (!cakeId || !name || !description) {
            return res.status(400).json({ message: 'Cake ID, name, and description are required.' });
        }
        const newTaste = new Taste({
            cakeId,
            name,
            description,
            img,
        });
        await newTaste.save();
        res.status(201).json(newTaste);
    } catch (error) {
        console.error('Error creating taste:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteTaste = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the Taste by ID and delete it
        const deletedTaste = await Taste.findByIdAndDelete(id);

        if (!deletedTaste) {
            return res.status(404).json({ message: 'Taste not found.' });
        }

        // Respond with the deleted Taste
        res.status(200).json(deletedTaste);
    } catch (error) {
        console.error('Error deleting taste:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateImg = async ([id, img], res) => {
    try {
        console.log('Updating taste with ID:', id);
        console.log('Updating img with:', img);

        const updatedTaste = await Taste.findByIdAndUpdate(
            id,
            { img },
            { new: true, runValidators: true }
        );

        if (!updatedTaste) {
            return res.status(404).json({ message: 'Taste not found.' });
        }

        // Respond with the updated Taste
        res.status(200).json(updatedTaste);
    } catch (error) {
        console.error('Error updating taste:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateTaste = async (req, res) => {
    try {
        const { id } = req.params;
        const { cakeId, name, description, img } = req.body;

        console.log('Updating taste with ID:', id);
        console.log('Updating img with:', img);

        // Find the Taste by ID and update its fields
        const updatedTaste = await Taste.findByIdAndUpdate(
            id,
            { cakeId, name, description, img },
            { new: true, runValidators: true }
        );

        if (!updatedTaste) {
            return res.status(404).json({ message: 'Taste not found.' });
        }

        res.status(200).json(updatedTaste);
    } catch (error) {
        console.error('Error updating taste:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllTastes = async (req, res) => {
    try {
        // Retrieve all Tastes from the database
        const tastes = await Taste.find();

        // Respond with the list of Tastes
        res.status(200).json(tastes);
    } catch (error) {
        console.error('Error retrieving tastes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTastesByCakeId = async (req, res) => {
    try {
        const { cakeId } = req.params;

        const tastes = await Taste.find({ cakeId });

        if (tastes.length === 0) {
            return res.status(404).json({ message: 'No tastes found for the specified cake ID.' });
        }
        res.status(200).json(tastes);
    } catch (error) {
        console.error('Error retrieving tastes by cake ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getTasteById = async (req, res) => {
    try {
        const { id } = req.params;

        const taste = await Taste.findById(id);

        if (!taste) {
            return res.status(404).json({ message: 'Taste not found.' });
        }
        res.status(200).json(taste);
    } catch (error) {
        console.error('Error retrieving taste by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};