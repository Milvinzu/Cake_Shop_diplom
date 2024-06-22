import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/UserModel.js';
import nodemailer from 'nodemailer';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import crypto from 'crypto';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, fullName, password, phoneNumber, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const userRole = role === 'admin' ? role : 'customer';
        
        if(req.role=='admin')
             role =req.role;
  
            const user = new User({
            email,
            fullName,
            passwordHash: hash,
            phoneNumber,
            role: userRole, 
        });

        const savedUser = await user.save();

        const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET || 'key123',
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = savedUser._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            message: "Couldn't register",
        });
    }
};

export const login = async (req, res)=>{
	try {
		const user = await User.findOne({email: req.body.email});
		if(!user){
			return res.status(404).json({ message :'User not found',})
		}
		
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		
		if(!isValidPass){
			return res.status(400).json({ message :'icorrect login or password',})
		}
		const token = jwt.sign({
			_id: user._id,
		},'key123',{
			expiresIn:  '30d',
		});
		const {passwordHash, ...userData}= user._doc;
		
		res.json({
			...userData,
			token,
		});

	} catch (err){
		return res.status(404).json({ message :'failed to login',})
	}

}

export const userInf = async (req, res)=>{

	try {
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).json({message: 'user not found',});
        }
        const { passwordHash, ...userData} =user._doc;

        res.json({userData});
	} catch (err){ 
		res.status(500).json({
			message: 'Couln`t register'
		})
	}
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { email, fullName, password, phoneNumber } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already registered' });
            }
            user.email = email;
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        const { passwordHash, ...userData } = updatedUser._doc;
        res.json(userData);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({
            message: "Couldn't update user",
        });
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Request password reset
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');

        const passwordResetToken = new PasswordResetToken({
            userId: user._id,
            token,
        });

        await passwordResetToken.save();

        // Send the password reset email
        sendPasswordResetEmail(user.email, token);

        res.json({ message: 'Password reset token has been sent to your email' });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify password reset token
export const verifyPasswordResetToken = async (req, res) => {
    const { token } = req.body;

    try {
        const passwordResetToken = await PasswordResetToken.findOne({ token });
        if (!passwordResetToken) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        res.json({ message: 'Token is valid' });
    } catch (error) {
        console.error('Error in verifyPasswordResetToken:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const passwordResetToken = await PasswordResetToken.findOneAndDelete({ token });
        if (!passwordResetToken) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(passwordResetToken.userId, { passwordHash: hashedPassword });

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};