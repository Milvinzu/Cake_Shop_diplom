import { body } from 'express-validator';

export const registerAdminValidation = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullName').isLength({ min: 6 }).withMessage('Full name must be at least 6 characters long'),
];
