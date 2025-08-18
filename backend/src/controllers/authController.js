import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { getWelcomeEmailTemplate, getVerificationEmailTemplate, getPasswordResetEmailTemplate } from "../config/emailTemplates.js";
import { v2 as cloudinary } from "cloudinary";

// Register User
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let avatarUrl = undefined;
        const imageFile = req.file; 
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            avatarUrl = imageUpload.secure_url;
        }

        const newUser = new userModel({ name, email, password: hashedPassword, role, avatar: avatarUrl });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     domain: '.vercel.app', // <- allows subdomains
        //     path: '/',
        //     maxAge: 24*60*60*1000
        // });

        // Sending Welcome Email 
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "🎉 Welcome to MERN Authentication System!",
            html: getWelcomeEmailTemplate(name, email),
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: `${name} is registered successfully` });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields (email and password) are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password."});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //     domain: '.vercel.app', // <- allows subdomains
        //     path: '/',
        //     maxAge: 24*60*60*1000
        // });

        return res.status(200).json({ success: true, message: `${user.name} is logged in successfully`});

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Logout User
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path: "/",
        });

        return res.status(200).json({ success: true, message: "Logged out" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        const hashedOtp = await bcrypt.hash(otp, 10);
        user.verifyOtp = hashedOtp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🔐 Verify Your Account - Security Code Inside",
            html: getVerificationEmailTemplate(otp)
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Verification OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Verify the User's Email
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "Enter all details (OTP) ",
        });
    }

    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.status(400).json({success: false, message: "Email is Already Verified"});
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({success: false, message: "OTP expired"});
        }

        const isOtpMatch = await bcrypt.compare(otp, user.verifyOtp);
        if (!user.verifyOtp || !isOtpMatch) {
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });

    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

// Check if User is Authenticated
export const isAuthenticated = (req, res) => {
    try{
        return res.status(200).json({ success: true, message: "User is authenticated" });

    }catch(error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Send Password Reset OTP 
export const sendResetOtp = async (req,res) =>
{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({success:false,message:"Email is required"});
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const hashedOtp = await bcrypt.hash(otp, 10);
        user.resetOtp = hashedOtp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🔒 Password Reset OTP",
            html: getPasswordResetEmailTemplate(otp)
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Password reset OTP sent successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message});
    }
}

// Reset User Password 
export const resetPassword = async (req,res) =>
{
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.status(400).json({success:false,message:"All fields (Email , Password , OTP) are required"});
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({success: false, message: "OTP expired"});
        }
        const isOtpMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!user.resetOtp || !isOtpMatch) {
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message:  error.message});
    }  
}