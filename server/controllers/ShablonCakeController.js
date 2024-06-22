import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import ShablonCake from '../models/ShablonCakeModel.js';

export const create = async (req, res) => {
    try {
        const { name, description, price, weight, img } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required.' });
        }

        const newShablonCake = new ShablonCake({
            name,
            description,
            price,
            weight,
            img,
        });

        await newShablonCake.save();

        res.status(201).json(newShablonCake);
    } catch (error) {
        console.error('Error creating shablon cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, weight, img } = req.body;

        const updatedShablonCake = await ShablonCake.findByIdAndUpdate(
            id,
            { name, description, price, weight, img },
            { new: true, runValidators: true }
        );

        if (!updatedShablonCake) {
            return res.status(404).json({ message: 'ShablonCake not found.' });
        }

        res.status(200).json(updatedShablonCake);
    } catch (error) {
        console.error('Error updating shablon cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedShablonCake = await ShablonCake.findByIdAndDelete(id);

        if (!deletedShablonCake) {
            return res.status(404).json({ message: 'ShablonCake not found.' });
        }

        res.status(200).json(deletedShablonCake);
    } catch (error) {
        console.error('Error deleting shablon cake:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const findOneById = async (req, res) => {
    try {
        const { id } = req.params;
        const shablonCake = await ShablonCake.findById(id);

        if (!shablonCake) {
            return res.status(404).json({ message: 'ShablonCake not found.' });
        }

        res.status(200).json(shablonCake);
    } catch (error) {
        console.error('Error finding shablon cake by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const findAll = async (req, res) => {
    try {
        const shablonCakes = await ShablonCake.find();
        res.status(200).json(shablonCakes);
    } catch (error) {
        console.error('Error fetching all shablon cakes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateCakeImg = async ([id, img], res) => {
    try {
        const updatedShablonCake = await ShablonCake.findByIdAndUpdate(
            id,
            { img },
            { new: true, runValidators: true }
        );

        if (!updatedShablonCake) {
            return res.status(404).json({ message: 'ShablonCake not found.' });
        }

        res.status(200).json(updatedShablonCake);
    } catch (error) {
        console.error('Error updating cake image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};